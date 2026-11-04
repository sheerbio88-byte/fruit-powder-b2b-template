export type ContactInquiryStatus = 'new' | 'contacted' | 'qualified' | 'closed' | 'spam';

/** Internal sales owners who follow up on inquiries */
export type ContactAssignee = 'Viggie' | 'Annie';

/**
 * 客户来源（流量 / 渠道归因）
 * value 存库用英文 slug，label 给内部看板中文展示
 */
export type ContactLeadSource =
  | 'google_organic'
  | 'google_ads'
  | 'chatgpt'
  | 'ai'
  | 'yahoo'
  | 'bing'
  | 'baidu'
  | 'alibaba'
  | 'facebook'
  | 'linkedin'
  | 'whatsapp'
  | 'email'
  | 'direct'
  | 'other';

export interface ContactInquiryRow {
  id: string;
  name: string;
  email: string;
  message: string;
  company: string | null;
  channel: string | null;
  product_interest: string | null;
  source_page: string | null;
  source_site: string | null;
  user_agent: string | null;
  ip_address: string | null;
  country: string | null;
  country_code: string | null;
  region: string | null;
  status: ContactInquiryStatus;
  /** 跟进人：Viggie / Annie，未分配为 null */
  assignee: ContactAssignee | null;
  /** 客户来源：Google自然流量 / 广告 / ChatGPT 等 */
  lead_source: ContactLeadSource | null;
  notes: string;
  extra: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ContactInquiryInsert {
  name: string;
  email: string;
  message?: string;
  company?: string | null;
  channel?: string | null;
  product_interest?: string | null;
  source_page?: string | null;
  source_site?: string | null;
  user_agent?: string | null;
  ip_address?: string | null;
  country?: string | null;
  country_code?: string | null;
  region?: string | null;
  status?: ContactInquiryStatus;
  assignee?: ContactAssignee | null;
  lead_source?: ContactLeadSource | null;
  notes?: string;
  extra?: Record<string, unknown>;
}

export interface ContactInquiryUpdate {
  status?: ContactInquiryStatus;
  assignee?: ContactAssignee | null;
  lead_source?: ContactLeadSource | null;
  notes?: string;
  name?: string;
  email?: string;
  message?: string;
  company?: string | null;
  channel?: string | null;
  product_interest?: string | null;
}

export const CONTACT_INQUIRY_STATUSES: {
  value: ContactInquiryStatus;
  label: string;
  tone: string;
}[] = [
  { value: 'new', label: '新询盘', tone: 'sky' },
  { value: 'contacted', label: '已联系', tone: 'amber' },
  { value: 'qualified', label: '有效线索', tone: 'emerald' },
  { value: 'closed', label: '已关闭', tone: 'slate' },
  { value: 'spam', label: '垃圾', tone: 'rose' },
];

export const CONTACT_ASSIGNEES: {
  value: ContactAssignee;
  label: string;
  tone: string;
}[] = [
  { value: 'Viggie', label: 'Viggie', tone: 'violet' },
  { value: 'Annie', label: 'Annie', tone: 'fuchsia' },
];

export const CONTACT_LEAD_SOURCES: {
  value: ContactLeadSource;
  label: string;
  tone: string;
}[] = [
  { value: 'google_organic', label: 'Google自然流量', tone: 'emerald' },
  { value: 'google_ads', label: 'Google广告', tone: 'amber' },
  { value: 'chatgpt', label: 'ChatGPT', tone: 'violet' },
  { value: 'ai', label: 'AI', tone: 'fuchsia' },
  { value: 'yahoo', label: 'Yahoo', tone: 'purple' },
  { value: 'bing', label: 'Bing', tone: 'sky' },
  { value: 'baidu', label: 'Baidu', tone: 'blue' },
  { value: 'alibaba', label: 'Alibaba', tone: 'orange' },
  { value: 'facebook', label: 'Facebook', tone: 'indigo' },
  { value: 'linkedin', label: 'LinkedIn', tone: 'cyan' },
  { value: 'whatsapp', label: 'WhatsApp', tone: 'green' },
  { value: 'email', label: 'Email', tone: 'rose' },
  { value: 'direct', label: '直接访问', tone: 'slate' },
  { value: 'other', label: '其他', tone: 'slate' },
];

export const CONTACT_LEAD_SOURCE_VALUES = CONTACT_LEAD_SOURCES.map((s) => s.value) as ContactLeadSource[];

export function isContactLeadSource(value: string | null | undefined): value is ContactLeadSource {
  return Boolean(value && (CONTACT_LEAD_SOURCE_VALUES as string[]).includes(value));
}

export function leadSourceLabel(value: ContactLeadSource | null | undefined): string {
  if (!value) return '未识别';
  return CONTACT_LEAD_SOURCES.find((s) => s.value === value)?.label ?? value;
}
