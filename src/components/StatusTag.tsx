import { Tag } from 'antd';
import { EnableStatus, ReviewStatus } from '../store/types';

export const ReviewTag = ({ status }: { status: ReviewStatus }) => {
  if (status === '待风控审核' || status === '待第三方审核') {
    return (
      <Tag style={{ background: '#e4e4e4', borderColor: '#cfcfcf', color: '#1f2937' }}>
        {status}
      </Tag>
    );
  }
  const color = status === '审核通过' ? 'success' : status === '审核不通过' ? 'error' : 'warning';
  return <Tag color={color}>{status}</Tag>;
};

export const EnableTag = ({ status }: { status: EnableStatus }) => {
  if (!status) return <span>-</span>;
  return <Tag color={status === '启用' ? 'green' : 'default'}>{status}</Tag>;
};
