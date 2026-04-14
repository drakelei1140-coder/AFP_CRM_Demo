import { createContext, useContext, useMemo, useState } from 'react';
import { enterpriseMockData } from './mockData';
import { Enterprise, ReviewStatus } from './types';

interface EnterpriseStore {
  enterprises: Enterprise[];
  getEnterprise: (id: string) => Enterprise | undefined;
  updateEnableStatus: (id: string, next: '启用' | '停用') => void;
  resubmit: (id: string) => void;
  approveByOps: (id: string, comment: string) => void;
  approveByRisk: (id: string, comment: string) => void;
  reject: (id: string, comment: string) => void;
  notifySupplement: (id: string, content: string, role: 'OPS' | '风控') => void;
  submitEditDraft: (id: string, payload: Partial<Enterprise>) => void;
}

const Ctx = createContext<EnterpriseStore | null>(null);
const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');
const hasNonAfp = (channels: string[]) => channels.some((c) => c !== 'Adyen-AFP');

export const EnterpriseStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>(enterpriseMockData);

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
      )
  }), [enterprises]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
};

export const useEnterpriseStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('Enterprise store missing');
  return ctx;
};
