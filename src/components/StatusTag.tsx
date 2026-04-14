import { Tag } from 'antd';
import { EnableStatus, ReviewStatus } from '../store/types';

export const ReviewTag = ({ status }: { status: ReviewStatus }) => {
  const color = status === '审核通过' ? 'success' : status === '审核不通过' ? 'error' : status === '待风控审核' ? 'processing' : 'warning';
  return <Tag color={color}>{status}</Tag>;
};

export const EnableTag = ({ status }: { status: EnableStatus }) => {
  if (!status) return <span>-</span>;
  return <Tag color={status === '启用' ? 'green' : 'default'}>{status}</Tag>;
};
