import { createContext, useContext, useMemo, useState } from 'react';
import { enterpriseMockData } from './mockData';
import { Enterprise, EnterpriseDraft, ReviewStatus } from './types';

interface EnterpriseStore {
  enterprises: Enterprise[];
  drafts: EnterpriseDraft[];
  getEnterprise: (id: string) => Enterprise | undefined;
  updateEnableStatus: (id: string, next: '启用' | '停用') => void;
  resubmit: (id: string) => void;
  approveByOps: (id: string, comment: string) => void;
  approveByRisk: (id: string, comment: string) => void;
  reject: (id: string, comment: string) => void;
  notifySupplement: (id: string, content: string, role: 'OPS' | '风控') => void;
  submitEditDraft: (id: string, payload: Partial<Enterprise>) => void;
  saveCreateDraft: (payload: Record<string, string>) => void;
  deleteDraft: (id: string) => void;
  createEnterprise: (payload: Record<string, string>) => Enterprise;
}

const Ctx = createContext<EnterpriseStore | null>(null);
const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');
const hasNonAfp = (channels: string[]) => channels.some((c) => c !== 'Adyen-AFP');

export const EnterpriseStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>(enterpriseMockData);
  const [drafts, setDrafts] = useState<EnterpriseDraft[]>([]);
  const currentOperator = '当前登录用户';

  const withTimeline = (ent: Enterprise, action: string, detail?: string) => ({
    ...ent,
    updatedAt: now(),
    timeline: [{ id: crypto.randomUUID(), time: now(), operator: '当前登录用户', action, detail }, ...ent.timeline]
  });

  const patchReview = (ent: Enterprise, reviewStatus: ReviewStatus, detail: string) => ({
    ...withTimeline(ent, '审核状态变更', detail),
    reviewStatus,
    enableStatus: reviewStatus === '审核通过' ? ent.enableStatus ?? '启用' : null
  });

  const api: EnterpriseStore = useMemo(() => ({
    enterprises,
    drafts: drafts.filter((d) => d.operator === currentOperator),
    getEnterprise: (id) => enterprises.find((e) => e.id === id),
    updateEnableStatus: (id, next) => setEnterprises((prev) => prev.map((e) => (e.id === id ? withTimeline({ ...e, enableStatus: next }, `${next}企业`) : e))),
    resubmit: (id) => setEnterprises((prev) => prev.map((e) => (e.id === id ? patchReview(e, '待审核', '重新提交审核') : e))),
    approveByOps: (id, comment) =>
      setEnterprises((prev) =>
        prev.map((e) => {
          if (e.id !== id) return e;
          if (hasNonAfp(e.channels)) return patchReview(e, '待风控审核', `OPS审核通过：${comment}`);
          return patchReview({ ...e, enableStatus: '启用' }, '审核通过', `OPS审核通过（仅AFP，跳过风控）：${comment}`);
        })
      ),
    approveByRisk: (id, comment) => setEnterprises((prev) => prev.map((e) => (e.id === id ? patchReview({ ...e, enableStatus: e.enableStatus ?? '启用' }, '审核通过', `风控审核通过：${comment}`) : e))),
    reject: (id, comment) => setEnterprises((prev) => prev.map((e) => (e.id === id ? patchReview(e, '审核不通过', `审核驳回：${comment}`) : e))),
    notifySupplement: (id, content, role) =>
      setEnterprises((prev) => prev.map((e) => (e.id === id ? withTimeline(e, `${role}通知补件`, content) : e))),
    submitEditDraft: (id, payload) =>
      setEnterprises((prev) =>
        prev.map((e) =>
          e.id === id
            ? withTimeline(e, '提交企业资料修改待审核', `变更字段：${Object.keys(payload).join('、')}`)
            : e
        )
      ),
    saveCreateDraft: (payload) =>
      setDrafts((prev) => {
        const curName = payload['商戶中文名稱'] || payload['切換商戶顯示名稱（中文）'] || payload['商戶英文名稱'] || '未命名企业';
        return [{
          id: crypto.randomUUID(),
          operator: currentOperator,
          name: String(curName),
          cidPreview: `CID-DRAFT-${String(prev.length + 1).padStart(3, '0')}`,
          createdAt: now(),
          updatedAt: now(),
          payload
        }, ...prev];
      }),
    deleteDraft: (id) => setDrafts((prev) => prev.filter((d) => d.id !== id)),
    createEnterprise: (payload) => {
      const nextId = `e-${Date.now()}`;
      const cid = `CID-${String(enterprises.length + 100).padStart(3, '0')}`;
      const name = payload['切換商戶顯示名稱（中文）'] || payload['商戶中文名稱'] || payload['商戶英文名稱'] || '新建企业';
      const toSection = (keys: string[]) => keys.reduce<Record<string, string>>((acc, key) => {
        if (payload[key]) acc[key] = payload[key];
        return acc;
      }, {});

      const created: Enterprise = {
        id: nextId,
        cid,
        leId: '-',
        name,
        shortName: payload['商戶中文簡稱'] || payload['切換商戶顯示名稱（中文）'] || '-',
        englishName: payload['商戶英文名稱'] || '-',
        region: payload['歸屬國編號'] || 'HK',
        reviewStatus: '待审核',
        enableStatus: null,
        channels: payload['進件通道(必須)']?.split(',').map((s) => s.trim()).filter(Boolean) || ['Adyen-AFP'],
        companyMode: payload['公司模式'] || '-',
        legalStatus: payload['法律地位'] || '-',
        phone: payload['公司電話'] || '-',
        email: payload['電郵地址'] || payload['管理員電郵'] || '-',
        createdAt: now(),
        updatedAt: now(),
        creator: currentOperator,
        source: payload['上單來源']?.split(',').map((s) => s.trim()).filter(Boolean) || ['CRM'],
        foundedAt: payload['成立日期'] || '-',
        overview: {
          企业主显示名称: name, CID: cid, '企业 LE ID': '-', 企业启用状态: '-', 企业审核状态: '待审核',
          '進件通道(必須)': payload['進件通道(必須)'] || '-', 上單來源: payload['上單來源'] || 'CRM', 創建時間: now(), 更新時間: now()
        },
        sections: {
          keys: toSection(['CID', '企业LE ID', '企业LE参考号', '默认主联系人人员ID', '進件通道(必須)']),
          names: toSection(['商戶中文名稱', '商戶中文簡稱', '商戶英文名稱', '商戶英文簡稱', '商戶其它名稱', '商戶所有名稱（中文）', '商戶所有名稱（英文）', '切換商戶顯示名稱（中文）', '切換商戶顯示名稱（英文）', '商業登記證名稱', '公司登記証名稱(非必須)']),
          operation: toSection(['公司模式', '是否子公司', '公司結構', '行業分類/業務性質/產品服務', 'MCC Code', '進階MCC Code', 'special MCC 附件', '小微商戶', 'SME 設定', '成立日期', '法律地位', '僱員人數', '注冊資本', '企业成立/适用法国家', '企业治理法律所在国', '企业税务申报分类', '企业税务业务类型', '公司層級']),
          basic: toSection(['進件通道(必須)', '每宗交易平均金額', '每宗交易最大交易額', '預計每年交易宗數', '過往拒付比例', '拒付平均處理日數', '過往退款比例', '退款平均處理日數', '平均每月營業額', '經營方式', '提前收款日數', '貨物/服務最短送達時間', '貨物/服務最長送達時間', '退貨政策', '退貨政策截圖', '財務報表審計', '經營年限', 'T1特選商戶', '歸屬國編號', '歸屬省編號', '是否對公', '分行號', '開戶費合計', '小費功能', '合約期']),
          contact: toSection(['公司電話', '手提電話', '管理員電郵', '運營電郵', '接收營銷資訊', '微信ID']),
          address: toSection(['註冊辦事處地址', '註冊辦事處地址(英文)', '郵寄地址', '電郵地址', '注册地址（原始全文）', '注册地址-街道', '注册地址-补充地址', '注册地址-城市', '注册地址-州/省', '注册地址-邮编', '注册地址-国家', '主要营业地址（原始全文）', '主要营业地址-街道', '主要营业地址-补充地址', '主要营业地址-城市', '主要营业地址-州/省', '主要营业地址-邮编', '主要营业地址-国家']),
          file: toSection(['商戶篩查報告', '企業架構文件', '財務報表文件', '商業登記證號碼', '證書有效期', '商業登記證副本照片']),
          risk: toSection(['風控類型', '風險等級', '風險評估報告', '審核類型', '上單來源', '服務類型', '合作夥伴推薦人', '合作夥伴編號', '交單備註', '是否高額商戶']),
          blah: toSection(['业务线ID', '业务线类型', '销售渠道', '资金流/清算模式', '账户持有人ID', '账户持有人关联LE ID', '账户持有人描述', '账户持有人参考号', '账户持有人状态'])
        },
        afpSummary: [{ key: 'LE.id', value: '-' }, { key: 'organization.legalName', value: '-' }, { key: 'organization.registeredAddress', value: '-' }],
        afpDetails: { 'LE.id': '-', 'organization.legalName': '-', 'organization.registeredAddress.fullText': '-', 'businessLine.id': '-' },
        devices: [],
        relatedCompanies: [],
        relatedPeople: [],
        shops: [],
        mids: [],
        timeline: [{ id: crypto.randomUUID(), time: now(), operator: currentOperator, action: '新建企业', detail: '新增企业提交后进入待审核' }]
      };
      setEnterprises((prev) => [created, ...prev]);
      return created;
    }
  }), [currentOperator, drafts, enterprises]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
};

export const useEnterpriseStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('Enterprise store missing');
  return ctx;
};
