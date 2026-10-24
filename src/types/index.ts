export type LeadStage = 'New' | 'Contacted' | 'Proposal' | 'Booked' | 'Won' | 'Lost';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Done' | 'No-show';
export type ProjectStatus = 'Planning' | 'In Progress' | 'Review' | 'Delivered' | 'Active Support';
export type MessageDirection = 'inbound' | 'outbound';
export type MessageStatus = 'draft' | 'sent' | 'delivered' | 'read' | 'opened';

export type ContactCategory =
  | 'Enterprise VIP'
  | 'High-Ticket Agency'
  | 'SMB / Clinic'
  | 'E-commerce'
  | 'Strategic Partner'
  | 'General Prospect';

export const CONTACT_CATEGORIES: ContactCategory[] = [
  'Enterprise VIP',
  'High-Ticket Agency',
  'SMB / Clinic',
  'E-commerce',
  'Strategic Partner',
  'General Prospect',
];

export type HotnessTier = 'Very Hot' | 'Hot' | 'Warm' | 'Cool' | 'Cold';

export interface ScoreFactor {
  id: string;
  label: string;
  points: number;
  category: 'funnel' | 'interactions' | 'recency' | 'value';
  description: string;
  positive: boolean;
}

export interface LeadScoreBreakdown {
  totalScore: number;
  tier: HotnessTier;
  tierColor: string;
  tierBadgeBg: string;
  funnelScore: number;
  interactionScore: number;
  recencyScore: number;
  valueScore: number;
  factors: ScoreFactor[];
  recommendedAction: string;
  matchedInteractions: {
    whatsappInbound: number;
    whatsappOutbound: number;
    emailOpened: number;
    emailSent: number;
    bookingsCount: number;
    hasActiveProject: boolean;
  };
}

export interface Lead {
  id: string;
  key?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  src: string;
  stage: LeadStage;
  val: number;
  need?: string;
  category?: ContactCategory | string;
  tags?: string[];
  statusNote?: string;
  message?: string;
  notes?: string;
  lastContactedAt?: string;
  createdAt: string;
  // Funnel & Lead Scoring extensions
  funnelId?: string;
  funnelName?: string;
  funnelStep?: string;
  customScoreAdjustment?: number;
}

export interface Booking {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  date: string;
  time: string;
  service?: string;
  durationMinutes?: number;
  meetingLink?: string;
  st: BookingStatus;
  notes?: string;
  reminderSent?: boolean;
  createdAt?: string;
}

export interface ChannelData {
  name: string;
  visits: number;
  spend: number;
  target: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  category: 'Strategy' | 'Design' | 'Engineering' | 'AI & Automation' | 'Launch & QA';
}

export interface ClientProject {
  id: string;
  clientName: string;
  email?: string;
  phone?: string;
  serviceType: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  deadline: string;
  dealValue: number;
  leadId?: string;
  milestones: ProjectMilestone[];
  notes?: string;
}

export interface WhatsAppMessage {
  id: string;
  clientId?: string;
  clientName: string;
  phone: string;
  direction: MessageDirection;
  text: string;
  status: MessageStatus;
  timestamp: string;
  templateUsed?: string;
}

export interface EmailThread {
  id: string;
  clientId?: string;
  clientName: string;
  email: string;
  subject: string;
  body: string;
  direction: MessageDirection;
  status: MessageStatus;
  timestamp: string;
}

export interface AgentAction {
  id: string;
  type: 'whatsapp_dispatch' | 'email_dispatch' | 'booking_confirm' | 'status_escalation' | 'proposal_generated' | 'crm_update' | 'milestone_completed';
  title: string;
  details: string;
  targetClient: string;
  status: 'pending_approval' | 'executed' | 'dismissed';
  autoExecuted: boolean;
  timestamp: string;
}

export interface AgentSettings {
  autoQualifyLeads: boolean;
  autoSendWhatsAppWelcome: boolean;
  autoSendBookingReminders: boolean;
  autoEscalateStaleLeads: boolean;
  autonomousMode: boolean;
}

export const TRAFFIC_SOURCES: string[] = [
  'SEO',
  'GEO (AI search)',
  'AEO (answers)',
  'Meta Ads',
  'Google Ads',
  'Google Business (GMB)',
  'WhatsApp',
  'Email',
  'Facebook',
  'Instagram',
  'TikTok',
  'YouTube',
  'LinkedIn',
  'X (Twitter)',
  'Affiliate',
  'Referral',
  'Direct/Other',
];

export const DEFAULT_CHANNELS: Record<string, [number, number, number]> = {
  'SEO': [420, 300, 30],
  'GEO (AI search)': [90, 0, 10],
  'AEO (answers)': [60, 0, 8],
  'Meta Ads': [1800, 600, 40],
  'Google Ads': [950, 500, 25],
  'Google Business (GMB)': [340, 0, 15],
  'WhatsApp': [0, 0, 15],
  'Email': [0, 40, 12],
  'Facebook': [500, 0, 10],
  'Instagram': [620, 0, 12],
  'TikTok': [900, 0, 10],
  'YouTube': [210, 0, 6],
  'LinkedIn': [150, 0, 6],
  'X (Twitter)': [70, 0, 3],
  'Affiliate': [180, 120, 8],
  'Referral': [40, 0, 5],
  'Direct/Other': [300, 0, 10],
};

export const STAGES: LeadStage[] = ['New', 'Contacted', 'Proposal', 'Booked', 'Won', 'Lost'];
export const BOOKING_STATUSES: BookingStatus[] = ['Pending', 'Confirmed', 'Done', 'No-show'];
export const PROJECT_STATUSES: ProjectStatus[] = ['Planning', 'In Progress', 'Review', 'Delivered', 'Active Support'];

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  leadCaptured?: boolean;
}

export type SupportedLanguage = 'en' | 'ar' | 'ur';

export interface QualificationData {
  businessType?: string;
  servicesInterested?: string[];
  serviceNeeded?: string;
  budgetRange?: string;
  budgetTier?: string;
  urgency?: string;
  qualificationScore: number;
  bookingRequested: boolean;
  bookingSlot?: string;
  suggestedSlot?: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
}

export interface WhatsAppIntegrationConfig {
  provider: 'meta_cloud' | 'qr_gateway' | 'twilio' | 'zapier_webhook';
  metaPhoneNumberId: string;
  metaWabaId: string;
  metaVerifyToken: string;
  metaAccessToken: string;
  webhookUrl: string;
  autoReplyEnabled: boolean;
  defaultLanguage: SupportedLanguage;
}

export type UserRole = 'ceo' | 'services_manager' | 'sales_rep' | 'client_viewer';

export const ALL_BUSINESS_MODULES = [
  'Ads & Social Launchpad',
  'CEO Reports & Approvals',
  'Integration Guide',
  'Payment Gateways & Banking',
  'Agent Console',
  'WhatsApp AI Agent',
  'WhatsApp & Email',
  'Automations',
  'Booking Calendar',
  'Services Delivery',
  'Funnels & Pages',
  'Templates',
  'CRM Pipeline',
  'Contacts',
  'Overview KPIs',
  'Analytics',
  'Funnel Performance',
  'Channel ROI',
  'Tracking links',
  'Connect landing',
  'CEO Security & Permissions',
] as const;

export interface FunnelPricingTier {
  id: string;
  name: string;
  price: number;
  period?: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface ServiceFunnel {
  id: string;
  slug: string;
  name: string;
  serviceCategory: string;
  targetAudience: string;
  headline: string;
  subheadline: string;
  heroHighlight: string;
  badge: string;
  ctaText: string;
  accentColor: 'emerald' | 'gold' | 'blue' | 'purple' | 'orange';
  deliverables: string[];
  benefits: string[];
  pricingTiers: FunnelPricingTier[];
  faqItems: Array<{ question: string; answer: string }>;
  visits: number;
  leads: number;
  won: number;
  conversionRate?: number;
  published: boolean;
  featured?: boolean;
  status: 'active' | 'draft' | 'testing';
  createdAt: string;
}

export type AutomationTriggerType =
  | 'lead_created'
  | 'stage_changed'
  | 'booking_confirmed'
  | 'lead_stale'
  | 'value_threshold'
  | 'category_assigned';

export type AutomationActionType =
  | 'send_email_sequence'
  | 'update_lead_stage'
  | 'combined_sequence';

export interface EmailSequenceStep {
  id: string;
  stepNumber: number;
  delayHours: number;
  delayLabel: string;
  subject: string;
  body: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  active: boolean;
  triggerType: AutomationTriggerType;
  triggerCondition?: {
    source?: string;
    fromStage?: LeadStage;
    toStage?: LeadStage;
    category?: string;
    minValue?: number;
    staleHours?: number;
  };
  actionType: AutomationActionType;
  targetStage?: LeadStage;
  statusNote?: string;
  tagsToAdd?: string[];
  emailSequence: EmailSequenceStep[];
  executionsCount: number;
  lastExecutedAt?: string;
  createdAt: string;
}

export interface AutomationExecutionLog {
  id: string;
  automationId: string;
  automationName: string;
  targetContact: string;
  targetEmail?: string;
  actionSummary: string;
  status: 'executed' | 'scheduled' | 'failed';
  timestamp: string;
}

export type BusinessModule = typeof ALL_BUSINESS_MODULES[number];

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  passcode: string;
  allowedModules: string[];
  lastLogin: string;
  active: boolean;
  avatarBg?: string;
  phone?: string;
}

export interface SecurityAuditLog {
  id: string;
  userName: string;
  userRole: UserRole;
  action: string;
  timestamp: string;
  ip: string;
  status?: 'success' | 'warning' | 'alert';
}

export interface GccBankAccount {
  id: string;
  bankName: string;
  country: 'UAE' | 'Saudi Arabia' | 'Bahrain' | 'Qatar' | 'Kuwait' | 'Oman';
  accountTitle: string;
  iban: string;
  swiftBic: string;
  currency: 'AED' | 'SAR' | 'BHD' | 'QAR' | 'KWD' | 'USD';
  supportedNetworks: ('Mada' | 'BenefitPay' | 'KNET' | 'QPay' | 'CBUAE Direct' | 'Wire')[];
  instructions: string;
  active: boolean;
}

export interface PakistaniBankAccount {
  id: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  raastId?: string; // SBP Raast mobile number or IBAN
  branchName?: string;
  branchCode?: string;
  currency: 'PKR' | 'USD';
  serviceType: 'IBFT / Raast' | 'Freelance Remittance (PRC)' | 'Corporate Digital';
  instructions: string;
  active: boolean;
}

export interface InternationalWireAccount {
  id: string;
  provider: 'US Federal Wire / ACH' | 'Wise Multi-Currency' | 'Payoneer Global' | 'Elevate Pay';
  accountTitle: string;
  accountNumber: string;
  routingNumberAba?: string;
  swiftBic?: string;
  bankName: string;
  bankAddress?: string;
  supportedCurrencies: ('USD' | 'EUR' | 'GBP' | 'CAD')[];
  instructions: string;
  active: boolean;
}

export interface PaymentGatewaySettings {
  stripe: {
    enabled: boolean;
    publishableKey: string;
    secretKeyConfigured: boolean;
    webhookSecretConfigured: boolean;
    defaultCurrency: string;
    retainerPaymentUrl: string;
    growthPlanPaymentUrl: string;
  };
  paypal: {
    enabled: boolean;
    clientId: string;
    clientSecretConfigured: boolean;
    merchantEmail: string;
    sandbox: boolean;
  };
  gccBanks: GccBankAccount[];
  pakistaniBanks: PakistaniBankAccount[];
  internationalWire: InternationalWireAccount[];
  crypto: {
    enabled: boolean;
    usdtTrc20Address: string;
    usdtErc20Address: string;
    instructions: string;
  };
}

export interface PaymentProofSubmission {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  dealId?: string;
  leadId?: string;
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'paypal' | 'gcc_bank' | 'pakistani_bank' | 'wise_payoneer' | 'crypto';
  paymentMethodLabel: string;
  transactionReference: string;
  receiptNote?: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface AdCampaign {
  id: string;
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin';
  campaignName: string;
  objective: 'leads' | 'sales' | 'whatsapp' | 'traffic';
  status: 'draft' | 'pending_approval' | 'ready_to_launch' | 'active' | 'paused';
  budgetDaily: number;
  targetAudience: string;
  geoTargets: string[];
  adCopy: {
    headline: string;
    primaryText: string;
    ctaText: string;
    format: 'single_image' | 'carousel' | 'video_reels' | 'responsive_search';
  };
  keywords?: string[];
  negativeKeywords?: string[];
  targetFunnelSlug: string;
  targetFunnelName: string;
  trackingUtm: string;
  leadsGenerated: number;
  spendTotal: number;
  roas: string;
  requiresCeoApproval: boolean;
  approvedByCeo?: boolean;
  createdAt: string;
  launchedAt?: string;
}

export interface SocialPageGuide {
  id: string;
  platform: 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'youtube' | 'gmb' | 'twitter';
  platformName: string;
  status: 'created' | 'pending_verification' | 'needs_setup';
  profileUrl?: string;
  handle: string;
  bioTemplate: string;
  suggestedPillars: string[];
  checklist: Array<{ id: string; label: string; done: boolean; desc?: string }>;
}

export interface SocialPostPlan {
  id: string;
  platform: 'meta' | 'instagram' | 'linkedin' | 'tiktok' | 'youtube' | 'twitter';
  title: string;
  content: string;
  hashtags: string[];
  targetFunnelSlug: string;
  utmLink: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate: string;
  likes?: number;
  clicks?: number;
}

export interface CeoApprovalItem {
  id: string;
  type: 'ad_campaign_launch' | 'proposal_dispatch' | 'high_ticket_deal' | 'milestone_signoff' | 'agent_action' | 'budget_allocation';
  title: string;
  details: string;
  entityName: string;
  amount?: number;
  currency?: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  decidedAt?: string;
  decisionNote?: string;
  urgency: 'high' | 'normal' | 'critical';
  associatedEntityId?: string;
}

export interface CeoNotificationSettings {
  ceoEmail: string;
  ceoPhone: string;
  emailAlertsEnabled: boolean;
  whatsappAlertsEnabled: boolean;
  dailyBriefingTime: string;
  autoEscalateUnapprovedHours: number;
  highValueThresholdUsd: number;
}



