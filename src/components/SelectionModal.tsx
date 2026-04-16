import { Button, Form, Input, Modal, Space, Table } from 'antd';
import { useMemo, useState } from 'react';

export interface SelectableItem {
  id: string;
  name: string;
  [key: string]: unknown;
}

export const SelectionModal = ({
  open,
  title,
  items,
  onCancel,
  onSelect,
  extraColumns = []
}: {
  open: boolean;
  title: string;
  items: SelectableItem[];
  onCancel: () => void;
  onSelect: (item: SelectableItem) => void;
  extraColumns?: Array<{ title: string; dataIndex: string }>;
}) => {
  const [form] = Form.useForm();
  const [keyword, setKeyword] = useState('');
  const [idKeyword, setIdKeyword] = useState('');

  const filtered = useMemo(
    () => items.filter((item) => item.id.toLowerCase().includes(idKeyword.toLowerCase()) && item.name.toLowerCase().includes(keyword.toLowerCase())),
    [idKeyword, items, keyword]
  );

  return (
    <Modal open={open} onCancel={onCancel} footer={null} title={title} width={900}>
      <Form form={form} layout="inline" style={{ marginBottom: 12 }}>
        <Form.Item label="按编号搜索"><Input value={idKeyword} onChange={(e) => setIdKeyword(e.target.value)} /></Form.Item>
        <Form.Item label="按名称搜索"><Input value={keyword} onChange={(e) => setKeyword(e.target.value)} /></Form.Item>
      </Form>
      <Table
        rowKey="id"
        pagination={{ pageSize: 6 }}
        dataSource={filtered}
        columns={[
          { title: '编号', dataIndex: 'id' },
          { title: '名称', dataIndex: 'name' },
          ...extraColumns,
          {
            title: '操作',
            render: (_, item) => (
              <Space>
                <Button type="link" onClick={() => onSelect(item as SelectableItem)}>选择</Button>
              </Space>
            )
          }
        ]}
      />
    </Modal>
  );
};
