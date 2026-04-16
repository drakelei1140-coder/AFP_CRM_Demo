import { InputNumber, Switch, Table } from 'antd';
import { useMemo } from 'react';

export interface ProductRateRow {
  key: string;
  product: 'Mastercard' | 'UnionPay' | 'Visa';
  type: '消费' | '预授权' | '退款' | '拒付';
  ratePct: number;
  fixedPct: number;
  fixedAmount: number;
  enabled: boolean;
}

export const buildRateRows = (): ProductRateRow[] => {
  const types: ProductRateRow['type'][] = ['消费', '预授权', '退款', '拒付'];
  const products: ProductRateRow['product'][] = ['Mastercard', 'UnionPay', 'Visa'];
  return products.flatMap((product) =>
    types.map((type, idx) => ({
      key: `${product}-${type}`,
      product,
      type,
      ratePct: Number((2.2 + idx * 0.1).toFixed(2)),
      fixedPct: Number((0.1 + idx * 0.02).toFixed(2)),
      fixedAmount: Number((0.5 + idx * 0.1).toFixed(2)),
      enabled: type !== '拒付'
    }))
  );
};

export const ProductRateTable = ({
  value,
  onChange,
  editable = false
}: {
  value: ProductRateRow[];
  onChange?: (rows: ProductRateRow[]) => void;
  editable?: boolean;
}) => {
  const columns = useMemo(
    () => [
      { title: '支付产品', dataIndex: 'product', width: 140 },
      { title: '类型', dataIndex: 'type', width: 120 },
      {
        title: '交易费率（百分比）',
        dataIndex: 'ratePct',
        width: 180,
        render: (val: number, row: ProductRateRow) =>
          editable ? (
            <InputNumber
              min={0}
              max={100}
              precision={2}
              value={val}
              style={{ width: '100%' }}
              onChange={(next) => {
                if (next === null || !onChange) return;
                onChange(value.map((r) => (r.key === row.key ? { ...r, ratePct: Number(next) } : r)));
              }}
            />
          ) : (
            `${val}%`
          )
      },
      {
        title: '固定收费-百分比',
        dataIndex: 'fixedPct',
        width: 170,
        render: (val: number, row: ProductRateRow) =>
          editable ? (
            <InputNumber
              min={0}
              max={100}
              precision={2}
              value={val}
              style={{ width: '100%' }}
              onChange={(next) => {
                if (next === null || !onChange) return;
                onChange(value.map((r) => (r.key === row.key ? { ...r, fixedPct: Number(next) } : r)));
              }}
            />
          ) : (
            `${val}%`
          )
      },
      {
        title: '固定收费-绝对值',
        dataIndex: 'fixedAmount',
        width: 170,
        render: (val: number, row: ProductRateRow) =>
          editable ? (
            <InputNumber
              min={0}
              precision={2}
              value={val}
              style={{ width: '100%' }}
              onChange={(next) => {
                if (next === null || !onChange) return;
                onChange(value.map((r) => (r.key === row.key ? { ...r, fixedAmount: Number(next) } : r)));
              }}
            />
          ) : (
            val
          )
      },
      {
        title: '开关',
        dataIndex: 'enabled',
        width: 110,
        render: (val: boolean, row: ProductRateRow) => (
          <Switch
            checked={val}
            disabled={!editable}
            onChange={(checked) => onChange?.(value.map((r) => (r.key === row.key ? { ...r, enabled: checked } : r)))}
          />
        )
      }
    ],
    [editable, onChange, value]
  );

  return <Table rowKey="key" pagination={false} dataSource={value} columns={columns} scroll={{ x: 900 }} />;
};
