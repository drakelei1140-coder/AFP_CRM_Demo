export type ReviewStatus = '待审核' | '待风控审核' | '审核通过' | '审核不通过';
export type EnableStatus = '启用' | '停用' | null;

export interface TimelineItem {
  id: string;
  time: string;
  operator: string;
  action: string;
  detail?: string;
}

export interface RelatedShop {
  id: string;
  name: string;
  region: string;
  enableStatus: EnableStatus;
  reviewStatus: ReviewStatus;
}

export interface RelatedMid {
  id: string;
  shopName: string;
  channel: string;
  status: string;
  updatedAt: string;
}

export interface Enterprise {
  id: string;
  cid: string;
  leId: string;
  name: string;
  shortName: string;
  englishName: string;
  region: string;
  reviewStatus: ReviewStatus;
  enableStatus: EnableStatus;
  channels: string[];
  companyMode: string;
  legalStatus: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  creator: string;
  source: string[];
  foundedAt: string;
  overview: Record<string, string | number | null>;
  sections: Record<string, Record<string, string>>;
  afpSummary: Array<{ key: string; value: string }>;
  afpDetails: Record<string, string>;
  devices: Array<{ id: string; model: string; status: string; bindShop: string }>;
  relatedCompanies: Array<{ id: string; name: string; relation: string }>;
  relatedPeople: Array<{ id: string; name: string; role: string; mobile: string }>;
  shops: RelatedShop[];
  mids: RelatedMid[];
  timeline: TimelineItem[];
}

export interface EnterpriseDraft {
  id: string;
  operator: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  cidPreview: string;
  payload: Record<string, string>;
}
