import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Lead,
  Booking,
  ChannelData,
  LeadStage,
  BookingStatus,
  ProjectStatus,
  ClientProject,
  WhatsAppMessage,
  EmailThread,
  AgentAction,
  AgentSettings,
  UserProfile,
  UserRole,
  SecurityAuditLog,
  TRAFFIC_SOURCES,
  DEFAULT_CHANNELS,
  AutomationRule,
  AutomationExecutionLog,
  EmailSequenceStep,
  ServiceFunnel,
  FunnelPricingTier,
  GccBankAccount,
  PakistaniBankAccount,
  InternationalWireAccount,
  PaymentGatewaySettings,
  PaymentProofSubmission,
  AdCampaign,
  SocialPageGuide,
  SocialPostPlan,
  CeoApprovalItem,
  CeoNotificationSettings,
} from '../types/index.ts';

interface BusinessContextType {
  // Ads & Social Launchpad:
  campaigns: AdCampaign[];
  socialGuides: SocialPageGuide[];
  socialPosts: SocialPostPlan[];
  addCampaign: (campaign: Omit<AdCampaign, 'id' | 'leadsGenerated' | 'spendTotal' | 'roas' | 'createdAt'>) => AdCampaign;
  updateCampaign: (id: string, updates: Partial<AdCampaign>) => void;
  launchCampaign: (id: string) => Promise<{ success: boolean; message: string }>;
  deleteCampaign: (id: string) => void;
  addSocialPost: (post: Omit<SocialPostPlan, 'id'>) => SocialPostPlan;
  toggleSocialChecklist: (platformId: string, checklistId: string) => void;

  // CEO Reports & Approvals:
  ceoApprovals: CeoApprovalItem[];
  ceoNotificationSettings: CeoNotificationSettings;
  updateCeoNotificationSettings: (settings: Partial<CeoNotificationSettings>) => void;
  createCeoApprovalRequest: (req: Omit<CeoApprovalItem, 'id' | 'status' | 'submittedAt'>) => CeoApprovalItem;
  decideCeoApproval: (id: string, decision: 'approved' | 'rejected', note?: string) => Promise<{ success: boolean; message: string }>;
  dispatchCeoBriefing: (channel: 'email' | 'whatsapp' | 'both', customNote?: string) => Promise<{ success: boolean; message: string; payload?: any }>;

  leads: Lead[];
  bookings: Booking[];
  channels: ChannelData[];
  projects: ClientProject[];
  whatsappMessages: WhatsAppMessage[];
  emailThreads: EmailThread[];
  agentActions: AgentAction[];
  agentSettings: AgentSettings;
  teamMembers: UserProfile[];
  auditLogs: SecurityAuditLog[];
  automations: AutomationRule[];
  automationLogs: AutomationExecutionLog[];
  funnels: ServiceFunnel[];
  activeFunnelId: string | null;
  setActiveFunnelId: (id: string | null) => void;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  baseUrl: string;
  currentView: 'public' | 'machine';
  setCurrentView: (v: 'public' | 'machine') => void;
  machineTab: string;
  setMachineTab: (t: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt'>>) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
  updateLeadValue: (id: string, val: number) => void;
  deleteLead: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id'>) => Booking;
  updateBookingStatus: (id: string, st: BookingStatus) => void;
  deleteBooking: (id: string) => void;
  updateChannel: (index: number, field: 'visits' | 'spend' | 'target', value: number) => void;
  setBaseUrl: (url: string) => void;
  importLeadsFromText: (text: string) => number;
  resetDemoData: () => void;
  recentNotification: string | null;
  clearNotification: () => void;
  newLeadsCountSinceView: number;
  resetNewLeadsCount: () => void;
  // Automations methods:
  addAutomation: (rule: Omit<AutomationRule, 'id' | 'executionsCount' | 'createdAt'>) => AutomationRule;
  updateAutomation: (id: string, updates: Partial<AutomationRule>) => void;
  toggleAutomationActive: (id: string) => void;
  deleteAutomation: (id: string) => void;
  triggerAutomation: (automationId: string, targetLeadId?: string) => Promise<{ success: boolean; executedSteps: number; summary: string }>;
  // Funnels & Pages methods:
  addFunnel: (funnel: Omit<ServiceFunnel, 'id' | 'visits' | 'leads' | 'won' | 'createdAt'>) => ServiceFunnel;
  updateFunnel: (id: string, updates: Partial<ServiceFunnel>) => void;
  toggleFunnelPublished: (id: string) => void;
  deleteFunnel: (id: string) => void;
  duplicateFunnel: (id: string) => ServiceFunnel;
  recordFunnelVisit: (funnelIdOrSlug: string) => void;
  // Control Agent & Services Manager methods:
  sendWhatsAppMessage: (msg: Omit<WhatsAppMessage, 'id' | 'timestamp'>) => void;
  sendEmail: (email: Omit<EmailThread, 'id' | 'timestamp'>) => void;
  createProject: (project: Omit<ClientProject, 'id'>) => ClientProject;
  updateProjectStatus: (id: string, status: ProjectStatus, progress?: number) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;
  approveAgentAction: (id: string) => void;
  dismissAgentAction: (id: string) => void;
  executeAgentCommand: (command: string) => Promise<{ success: boolean; reply: string }>;
  updateAgentSettings: (settings: Partial<AgentSettings>) => void;
  // CEO Security & Role-Based Access Control methods:
  login: (email: string, passcode: string) => { success: boolean; error?: string };
  logout: () => void;
  switchActiveRole: (role: UserRole) => void;
  updateUserPermissions: (userId: string, allowedModules: string[]) => void;
  addTeamMember: (member: Omit<UserProfile, 'id' | 'lastLogin'>) => void;
  deleteTeamMember: (userId: string) => void;
  toggleUserActiveStatus: (userId: string) => void;
  resetUserPassword: (userId: string, newPasscode: string) => void;
  emergencyLockdown: () => void;
  // Global Banking & Payment Gateway methods:
  paymentSettings: PaymentGatewaySettings;
  paymentProofs: PaymentProofSubmission[];
  updatePaymentSettings: (settings: Partial<PaymentGatewaySettings>) => void;
  addPaymentProof: (proof: Omit<PaymentProofSubmission, 'id' | 'submittedAt' | 'status'>) => PaymentProofSubmission;
  verifyPaymentProof: (id: string, status: 'verified' | 'rejected') => void;
  deletePaymentProof: (id: string) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  paymentModalPrefill: { amount?: number; currency?: string; clientName?: string; note?: string; method?: string } | null;
  openPaymentModal: (prefill?: { amount?: number; currency?: string; clientName?: string; note?: string; method?: string }) => void;
  closePaymentModal: () => void;
  isModuleAllowed: (moduleName: string) => boolean;
}

const STORAGE_KEY = 'bfb_control_agent_v4';

const initialDemoData = () => {
  const initialChannels: ChannelData[] = TRAFFIC_SOURCES.map((name) => {
    const d = DEFAULT_CHANNELS[name] || [0, 0, 0];
    return { name, visits: d[0], spend: d[1], target: d[2] };
  });

  const initialLeads: Lead[] = [
    {
      id: 'lead-1',
      name: 'Ali Raza',
      company: 'Ali Traders Corp',
      position: 'Managing Director',
      phone: '923001234567',
      email: 'ali@traderscorp.com',
      src: 'Meta Ads',
      stage: 'Won',
      val: 1200,
      category: 'E-commerce',
      tags: ['Stripe Active', 'High ROAS', 'Direct Client'],
      statusNote: 'Payment confirmed. Onboarding funnel in engineering sprint.',
      need: 'E-commerce & Ads',
      notes: 'Payment confirmed. Onboarding funnel in engineering sprint.',
      funnelId: 'fnl-3',
      funnelName: 'Omni-Channel E-Commerce ROAS Scale Funnel',
      funnelStep: 'Payment Completed',
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    },
    {
      id: 'lead-2',
      name: 'Dr. Sara Clinic',
      company: 'Premier Healthcare Group',
      position: 'Lead Medical Director',
      phone: '923331112223',
      email: 'sara@premierhealth.org',
      src: 'SEO',
      stage: 'Booked',
      val: 800,
      category: 'SMB / Clinic',
      tags: ['VIP Medical', 'WhatsApp Funnel', 'High Intent'],
      statusNote: 'Strategy call confirmed for 22nd Oct 11:00 AM.',
      need: 'Booking Funnel & AI Chatbot',
      notes: 'Strategy call confirmed for 22nd Oct 11:00 AM.',
      funnelId: 'fnl-2',
      funnelName: 'VIP Aesthetics & Smile Clinic Funnel',
      funnelStep: 'Discovery Call Booked',
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    },
    {
      id: 'lead-3',
      name: 'Hamza Store',
      company: 'Hamza Retail & DTC',
      position: 'E-Commerce VP',
      phone: '923451234567',
      email: 'hamza@retailhub.com',
      src: 'Google Ads',
      stage: 'Proposal',
      val: 1500,
      category: 'High-Ticket Agency',
      tags: ['Proposal Out', 'Follow-up Due'],
      statusNote: 'Proposal sent. Awaiting contract approval.',
      need: 'High-AOV Checkout Funnel',
      notes: 'Proposal sent. Awaiting contract approval.',
      funnelId: 'fnl-1',
      funnelName: 'High-Ticket Consulting & Advisory Funnel',
      funnelStep: 'Pricing Selected',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      id: 'lead-4',
      name: 'Noor Fashion',
      company: 'Noor Haute Couture',
      position: 'Creative Director',
      phone: '923211234567',
      email: 'contact@noorfashion.ae',
      src: 'WhatsApp',
      stage: 'Contacted',
      val: 400,
      category: 'SMB / Clinic',
      tags: ['Fashion', 'WhatsApp Qualified'],
      statusNote: 'WhatsApp demo presented. Follow-up requested.',
      need: 'AI Chatbot & Automation',
      notes: 'WhatsApp demo presented. Follow-up requested.',
      funnelId: 'fnl-4',
      funnelName: 'AI WhatsApp Receptionist & Lead Closer',
      funnelStep: 'Deliverables Selected',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 'lead-5',
      name: 'Zain Realty',
      company: 'Zain Global Properties',
      position: 'Principal Broker',
      phone: '923121234567',
      email: 'zain@realtygroup.us',
      src: 'GEO (AI search)',
      stage: 'New',
      val: 2000,
      category: 'Enterprise VIP',
      tags: ['Enterprise Deal', 'GEO Search Inbound'],
      statusNote: 'High intent prospect via Perplexity / Google AI search.',
      need: 'Full AI Business System',
      notes: 'High intent prospect via Perplexity / Google AI search.',
      funnelId: 'fnl-1',
      funnelName: 'High-Ticket Consulting & Advisory Funnel',
      funnelStep: 'Application Submitted',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'lead-6',
      name: 'Bilal Gym & Fitness',
      company: 'Bilal Performance Centers',
      position: 'Owner & Operator',
      phone: '923011234567',
      email: 'bilal@fitgym.com',
      src: 'Email',
      stage: 'Won',
      val: 600,
      category: 'Strategic Partner',
      tags: ['SaaS Retainer', 'Active Client'],
      statusNote: 'Stripe subscription active. Portal live.',
      need: 'App or SaaS Member Funnel',
      notes: 'Stripe subscription active. Portal live.',
      funnelId: 'fnl-6',
      funnelName: 'Productized SaaS & Subscription Growth Funnel',
      funnelStep: 'Checkout Initiated',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ];

  const initialBookings: Booking[] = [
    {
      id: 'bk-1',
      name: 'Dr. Sara Clinic',
      email: 'sara@premierhealth.org',
      phone: '923331112223',
      date: '2026-10-22',
      time: '11:00',
      service: 'Growth Strategy Session',
      durationMinutes: 45,
      meetingLink: 'https://meet.google.com/bfb-sara-growth',
      st: 'Confirmed',
      notes: 'Review clinic lead gen and patient booking intake automation.',
      reminderSent: true,
    },
    {
      id: 'bk-2',
      name: 'Hamza Store',
      email: 'hamza@retailhub.com',
      phone: '923451234567',
      date: '2026-10-24',
      time: '15:30',
      service: 'Funnel Architecture Review',
      durationMinutes: 30,
      meetingLink: 'https://meet.google.com/bfb-hamza-funnel',
      st: 'Pending',
      notes: 'Walkthrough proposal and Stripe checkout integration.',
      reminderSent: false,
    },
    {
      id: 'bk-3',
      name: 'Zain Realty',
      email: 'zain@realtygroup.us',
      phone: '923121234567',
      date: '2026-10-26',
      time: '14:00',
      service: 'Executive AI Architecture Kickoff',
      durationMinutes: 60,
      meetingLink: 'https://meet.google.com/bfb-zain-ai',
      st: 'Confirmed',
      notes: 'Multi-agent CRM and automated property valuation chatbot.',
      reminderSent: true,
    },
  ];

  const initialProjects: ClientProject[] = [
    {
      id: 'proj-1',
      clientName: 'Bab Al-Khaleej Business Consultant',
      email: 'office@babalkhaleej.bh',
      phone: '+973 1700 0000',
      serviceType: 'Full AI Business System & CRM',
      status: 'Active Support',
      progress: 95,
      startDate: '2026-08-15',
      deadline: '2026-11-01',
      dealValue: 5000,
      notes: 'Enterprise consultancy infrastructure deployed. Monthly retainers active.',
      milestones: [
        { id: 'm-1', title: 'Brand Identity & Funnel Architecture', completed: true, dueDate: '2026-08-30', category: 'Strategy' },
        { id: 'm-2', title: 'Custom High-Speed Website & Portal', completed: true, dueDate: '2026-09-15', category: 'Engineering' },
        { id: 'm-3', title: '24/7 AI Chatbot & WhatsApp Bridge', completed: true, dueDate: '2026-09-30', category: 'AI & Automation' },
        { id: 'm-4', title: 'CRM Pipeline & Real-Time Analytics', completed: true, dueDate: '2026-10-10', category: 'Engineering' },
        { id: 'm-5', title: 'Ongoing Scale & SEO Optimization', completed: false, dueDate: '2026-11-01', category: 'Launch & QA' },
      ],
    },
    {
      id: 'proj-2',
      clientName: 'Ali Traders',
      email: 'ali@traderscorp.com',
      phone: '923001234567',
      serviceType: 'E-commerce Funnel & Meta Ads',
      status: 'In Progress',
      progress: 60,
      startDate: '2026-10-15',
      deadline: '2026-10-31',
      dealValue: 1200,
      notes: 'Funnel copy and Stripe checkout ready. Launching Meta retargeting.',
      milestones: [
        { id: 'm-6', title: 'Audience Research & Offer Structure', completed: true, dueDate: '2026-10-18', category: 'Strategy' },
        { id: 'm-7', title: 'Landing Page & One-Click Upsells', completed: true, dueDate: '2026-10-22', category: 'Design' },
        { id: 'm-8', title: 'Abandoned Cart WhatsApp Workflow', completed: false, dueDate: '2026-10-26', category: 'AI & Automation' },
        { id: 'm-9', title: 'Ad Creative Deployment & QA', completed: false, dueDate: '2026-10-31', category: 'Launch & QA' },
      ],
    },
    {
      id: 'proj-3',
      clientName: 'Dr. Sara Clinic',
      email: 'sara@premierhealth.org',
      phone: '923331112223',
      serviceType: 'Automated Booking Funnel & AI Receptionist',
      status: 'Planning',
      progress: 25,
      startDate: '2026-10-20',
      deadline: '2026-11-10',
      dealValue: 800,
      notes: 'Kickoff booked. Gathering clinic intake questionnaires.',
      milestones: [
        { id: 'm-10', title: 'Intake Questionnaire & Appointment Types', completed: true, dueDate: '2026-10-23', category: 'Strategy' },
        { id: 'm-11', title: 'Automated Calendar & SMS Reminders', completed: false, dueDate: '2026-10-29', category: 'Engineering' },
        { id: 'm-12', title: 'AI Patient FAQ Chatbot on WhatsApp', completed: false, dueDate: '2026-11-05', category: 'AI & Automation' },
      ],
    },
  ];

  const initialWhatsAppMessages: WhatsAppMessage[] = [
    {
      id: 'wa-1',
      clientName: 'Ali Traders',
      phone: '923001234567',
      direction: 'inbound',
      text: 'Salam Ghazi, payment transfer is completed for the Growth Funnel package. Excited to start!',
      status: 'read',
      timestamp: 'Yesterday 14:22',
    },
    {
      id: 'wa-2',
      clientName: 'Ali Traders',
      phone: '923001234567',
      direction: 'outbound',
      text: 'Waleikum Assalam Ali! Welcome aboard. Our engineering team has already spun up your staging environment and funnel architecture.',
      status: 'read',
      timestamp: 'Yesterday 14:25',
    },
    {
      id: 'wa-3',
      clientName: 'Dr. Sara Clinic',
      phone: '923331112223',
      direction: 'outbound',
      text: 'Hi Dr. Sara! Your strategy session with Ghazi Wazir is confirmed for Thursday Oct 22 at 11:00 AM. Here is your Google Meet link: https://meet.google.com/bfb-sara-growth',
      status: 'delivered',
      timestamp: 'Today 09:15',
      templateUsed: 'Meeting Confirmation',
    },
    {
      id: 'wa-4',
      clientName: 'Hamza Store',
      phone: '923451234567',
      direction: 'outbound',
      text: 'Hi Hamza, your custom High-AOV Funnel proposal is ready for review. Did you have a chance to look over the deliverables?',
      status: 'sent',
      timestamp: 'Today 10:40',
      templateUsed: 'Proposal Follow-up',
    },
  ];

  const initialEmailThreads: EmailThread[] = [
    {
      id: 'em-1',
      clientName: 'Dr. Sara Clinic',
      email: 'sara@premierhealth.org',
      subject: 'Confirmed: Back for Brand Growth Session (Dr. Sara Clinic)',
      body: `Dear Dr. Sara,\n\nWe are looking forward to our strategy session on Thursday, October 22 at 11:00 AM.\n\nAgenda:\n1. Analyzing your patient acquisition pipeline\n2. Demonstrating the 24/7 AI WhatsApp receptionist\n3. Zero no-show booking workflow architecture\n\nGoogle Meet: https://meet.google.com/bfb-sara-growth\n\nBest regards,\nGhazi Wazir\nFounder & CEO, Back for Brand LLC`,
      direction: 'outbound',
      status: 'sent',
      timestamp: 'Today 09:16',
    },
    {
      id: 'em-2',
      clientName: 'Hamza Store',
      email: 'hamza@retailhub.com',
      subject: 'Proposal & Scope of Work: High-AOV Funnel Implementation',
      body: `Hi Hamza,\n\nAttached is your comprehensive proposal for the High-AOV Checkout Funnel and Meta retargeting campaigns.\n\nKey deliverables:\n- Conversion copywriting & mobile UX\n- Post-purchase 1-click upsell architecture\n- Abandoned cart recovery triggers\n\nPlease review and let us know if you need any adjustments.\n\nWarm regards,\nBack for Brand Operations`,
      direction: 'outbound',
      status: 'opened',
      timestamp: 'Today 10:42',
    },
  ];

  const initialAgentActions: AgentAction[] = [
    {
      id: 'act-1',
      type: 'whatsapp_dispatch',
      title: 'Send 24h Booking Reminder to Dr. Sara',
      details: 'Dr. Sara has an upcoming session tomorrow at 11:00 AM. Dispatch automated WhatsApp reminder with Meet link.',
      targetClient: 'Dr. Sara Clinic',
      status: 'pending_approval',
      autoExecuted: false,
      timestamp: '10 mins ago',
    },
    {
      id: 'act-2',
      type: 'status_escalation',
      title: 'Follow up on Hamza Store Proposal',
      details: 'Proposal sent 18 hours ago. Hamza opened the email thread. Recommend sending WhatsApp nudge.',
      targetClient: 'Hamza Store',
      status: 'pending_approval',
      autoExecuted: false,
      timestamp: '25 mins ago',
    },
    {
      id: 'act-3',
      type: 'crm_update',
      title: 'Auto-Qualified High-Value Lead: Zain Realty ($2,000)',
      details: 'AI Concierge evaluated inbound inquiry from GEO search. Match score: 98%. Recommended priority outreach.',
      targetClient: 'Zain Realty',
      status: 'executed',
      autoExecuted: true,
      timestamp: '2 hours ago',
    },
  ];

  const initialSettings: AgentSettings = {
    autoQualifyLeads: true,
    autoSendWhatsAppWelcome: true,
    autoSendBookingReminders: true,
    autoEscalateStaleLeads: true,
    autonomousMode: true,
  };

  const initialTeam: UserProfile[] = [
    {
      id: 'usr-ceo',
      name: 'Ghazi Wazir',
      email: 'backforbrand@gmail.com',
      role: 'ceo',
      title: 'Chief Executive Officer (Founder)',
      passcode: 'ceo777',
      allowedModules: ['*'], // Full Master CEO Access
      lastLogin: 'Just now (Active)',
      active: true,
    },
    {
      id: 'usr-services',
      name: 'Tariq Mansoor',
      email: 'tariq@backforbrand.com',
      role: 'services_manager',
      title: 'Services & Operations Manager',
      passcode: 'services123',
      allowedModules: ['Services Delivery', 'Funnels & Pages', 'Template Gallery', 'Templates', 'Booking Calendar', 'WhatsApp & Email', 'Automations', 'Analytics', 'Contacts'],
      lastLogin: 'Today 08:30 AM',
      active: true,
    },
    {
      id: 'usr-sales',
      name: 'Sara Ahmed',
      email: 'sara@backforbrand.com',
      role: 'sales_rep',
      title: 'Senior Acquisition & CRM Executive',
      passcode: 'sales123',
      allowedModules: ['CRM Pipeline', 'Contacts', 'Funnels & Pages', 'Template Gallery', 'Templates', 'Automations', 'WhatsApp AI Agent', 'Tracking links', 'Analytics'],
      lastLogin: 'Today 09:12 AM',
      active: true,
    },
    {
      id: 'usr-client',
      name: 'Bab Al-Khaleej Representative',
      email: 'client@babalkhaleej.bh',
      role: 'client_viewer',
      title: 'Enterprise Client Representative',
      passcode: 'client123',
      allowedModules: ['Services Delivery', 'Booking Calendar'],
      lastLogin: 'Yesterday 17:00 PM',
      active: true,
    },
  ];

  const initialAuditLogs: SecurityAuditLog[] = [
    {
      id: 'log-sec-1',
      userName: 'Ghazi Wazir (CEO)',
      userRole: 'ceo',
      action: 'CEO authenticated with master key. Full business dashboard control unlocked.',
      timestamp: 'Today 08:00 AM',
      ip: '172.56.21.90 (Florida, USA)',
    },
    {
      id: 'log-sec-2',
      userName: 'Ghazi Wazir (CEO)',
      userRole: 'ceo',
      action: 'Allocated area permissions: Services Delivery & Calendar assigned to Tariq Mansoor.',
      timestamp: 'Today 08:31 AM',
      ip: '172.56.21.90 (Florida, USA)',
    },
    {
      id: 'log-sec-3',
      userName: 'Sara Ahmed',
      userRole: 'sales_rep',
      action: 'Accessed allocated CRM Pipeline & WhatsApp Agent queue.',
      timestamp: 'Today 09:15 AM',
      ip: '198.51.100.22',
    },
  ];

  const initialAutomations: AutomationRule[] = [
    {
      id: 'auto-1',
      name: 'Inbound Lead Nurture & Stage Progression',
      description: 'Auto-dispatches 3-step value sequence and advances lead stage to "Contacted" with "Nurture Active" tag.',
      active: true,
      triggerType: 'lead_created',
      triggerCondition: {
        source: 'Any Source',
      },
      actionType: 'combined_sequence',
      targetStage: 'Contacted',
      statusNote: 'Inbound welcome series dispatched automatically',
      tagsToAdd: ['Nurture Active', 'Auto-Contacted'],
      executionsCount: 14,
      lastExecutedAt: 'Today 10:15 AM',
      createdAt: '2026-10-01',
      emailSequence: [
        {
          id: 'step-1',
          stepNumber: 1,
          delayHours: 0,
          delayLabel: 'Immediate',
          subject: 'Welcome to Back for Brand: Your Free Growth Strategy Architecture',
          body: 'Hi {{name}},\n\nThank you for requesting a growth consultation with Back for Brand. Our engineering and conversion architecture team has already analyzed your business vertical.\n\nOver the next few days, we will share how we build automated client acquisition machines that convert cold clicks into paying high-ticket contracts 24/7.\n\nWarm regards,\nGhazi Wazir\nFounder & CEO, Back for Brand LLC',
        },
        {
          id: 'step-2',
          stepNumber: 2,
          delayHours: 24,
          delayLabel: 'After 24 hours',
          subject: '3 Leaks in Service Business Funnels (And How to Fix Them)',
          body: 'Salam {{name}},\n\nDid you know that 68% of qualified buyers bounce because agencies take longer than 15 minutes to respond?\n\nThat is why our autonomous WhatsApp AI agent replies in < 45 seconds in English, Arabic, and Urdu, qualifying budgets and locking in calendar slots on autopilot.\n\nBest regards,\nBack for Brand Systems Team',
        },
        {
          id: 'step-3',
          stepNumber: 3,
          delayHours: 48,
          delayLabel: 'After 48 hours',
          subject: 'Exclusive Strategy Session Invitation with Ghazi Wazir',
          body: 'Hi {{name}},\n\nWe have 2 executive onboarding slots open this week for {{company}}.\n\nPick a time on our direct calendar: https://meet.google.com/bfb-growth\n\nLooking forward to speaking!\nGhazi Wazir',
        },
      ],
    },
    {
      id: 'auto-2',
      name: 'High-Ticket Proposal Closer & Follow-up',
      description: 'Triggered when lead reaches Proposal stage. Delivers formal scope and 24h follow-up nudge.',
      active: true,
      triggerType: 'stage_changed',
      triggerCondition: {
        toStage: 'Proposal',
      },
      actionType: 'combined_sequence',
      statusNote: 'Proposal sequence dispatched. Tracking client review.',
      tagsToAdd: ['Proposal Sent', 'Awaiting Sign-off'],
      executionsCount: 6,
      lastExecutedAt: 'Yesterday 16:30 PM',
      createdAt: '2026-10-05',
      emailSequence: [
        {
          id: 'step-p1',
          stepNumber: 1,
          delayHours: 0,
          delayLabel: 'Immediate',
          subject: 'Your Custom Funnel & Business System Proposal: {{name}}',
          body: 'Dear {{name}},\n\nAttached is your formal scope of work covering full-stack funnel copywriting, custom web engineering, AI WhatsApp closers, and CRM automation.\n\nPlease review the deliverables and let us know if you need any adjustments before kickoff.\n\nWarm regards,\nBack for Brand Operations',
        },
        {
          id: 'step-p2',
          stepNumber: 2,
          delayHours: 24,
          delayLabel: 'After 24 hours',
          subject: 'Questions about your proposal scope for {{company}}?',
          body: 'Hi {{name}},\n\nFollowing up to check if you had any questions on the proposal or milestone timelines. You can finalize your retainer deposit directly here: https://buy.stripe.com/bfb-retainer\n\nBest regards,\nGhazi Wazir',
        },
      ],
    },
    {
      id: 'auto-3',
      name: 'Booking Confirmed & Zero-No-Show Sync',
      description: 'Triggered on strategy session booking. Sends calendar invite and updates lead status to "Booked".',
      active: true,
      triggerType: 'booking_confirmed',
      actionType: 'combined_sequence',
      targetStage: 'Booked',
      statusNote: 'Meeting booked. Google Meet link generated and calendar synced.',
      tagsToAdd: ['Call Confirmed', 'Google Meet Ready'],
      executionsCount: 9,
      lastExecutedAt: 'Today 09:20 AM',
      createdAt: '2026-10-08',
      emailSequence: [
        {
          id: 'step-b1',
          stepNumber: 1,
          delayHours: 0,
          delayLabel: 'Immediate',
          subject: 'Confirmed: Back for Brand Strategy Session with Ghazi Wazir',
          body: 'Hi {{name}},\n\nYour strategy call is officially confirmed on our executive calendar!\n\nGoogle Meet: https://meet.google.com/bfb-growth\n\nPlease have your current website metrics, ad spend, and target revenue ready for our breakdown.\n\nWarm regards,\nGhazi Wazir\nFounder, Back for Brand LLC',
        },
      ],
    },
    {
      id: 'auto-4',
      name: 'Stale Lead Escalation & Re-engagement',
      description: 'Triggered when a lead is in New or Contacted status for > 48 hours without progress.',
      active: false,
      triggerType: 'lead_stale',
      triggerCondition: {
        staleHours: 48,
      },
      actionType: 'send_email_sequence',
      targetStage: 'Contacted',
      statusNote: 'Re-engagement nudge dispatched',
      tagsToAdd: ['Re-engagement Sent'],
      executionsCount: 3,
      lastExecutedAt: '3 days ago',
      createdAt: '2026-10-12',
      emailSequence: [
        {
          id: 'step-s1',
          stepNumber: 1,
          delayHours: 0,
          delayLabel: 'Immediate',
          subject: 'Checking in on {{company}} growth goals',
          body: 'Hi {{name}},\n\nWe noticed we have not connected since your initial inquiry. If you are still seeking to scale customer bookings this quarter, our team is standing by.\n\nBest regards,\nBack for Brand Team',
        },
      ],
    },
  ];

  const initialAutomationLogs: AutomationExecutionLog[] = [
    {
      id: 'log-auto-1',
      automationId: 'auto-1',
      automationName: 'Inbound Lead Nurture & Stage Progression',
      targetContact: 'Ali Raza (Ali Traders Corp)',
      targetEmail: 'ali@traderscorp.com',
      actionSummary: 'Dispatched Step 1 Welcome Email + Updated Stage to Contacted + Tagged "Nurture Active"',
      status: 'executed',
      timestamp: 'Today 10:15 AM',
    },
    {
      id: 'log-auto-2',
      automationId: 'auto-2',
      automationName: 'High-Ticket Proposal Closer & Follow-up',
      targetContact: 'Hamza Store (Hamza Retail)',
      targetEmail: 'hamza@retailhub.com',
      actionSummary: 'Dispatched Proposal Scope Email + Updated Status Note',
      status: 'executed',
      timestamp: 'Yesterday 16:30 PM',
    },
    {
      id: 'log-auto-3',
      automationId: 'auto-3',
      automationName: 'Booking Confirmed & Zero-No-Show Sync',
      targetContact: 'Dr. Sara Clinic (Premier Health)',
      targetEmail: 'sara@premierhealth.org',
      actionSummary: 'Dispatched Google Meet Invite + Updated Lead Stage to "Booked"',
      status: 'executed',
      timestamp: 'Today 09:20 AM',
    },
  ];

  const initialFunnels: ServiceFunnel[] = [
    {
      id: 'fnl-1',
      slug: 'consulting-growth',
      name: 'High-Ticket Consulting & Advisory Funnel',
      serviceCategory: 'Consulting & Strategy',
      targetAudience: 'Management Consultants, Advisory Firms & High-Ticket B2B',
      headline: 'Turn High-Intent Traffic Into Booked Consulting Retainers ($3k-$10k)',
      subheadline: 'Eliminate proposal chasing. We engineer high-authority conversion copy, an autonomous WhatsApp qualifier in <45s, and a calendar sync engine tailored for advisory firms.',
      heroHighlight: '3.4x Higher Strategy Session Bookings',
      badge: 'B2B Advisory Engine',
      ctaText: 'Claim Free Funnel Blueprint',
      accentColor: 'gold',
      deliverables: [
        'Strategic conversion copywriting & executive layout',
        '24/7 Trilingual WhatsApp qualifier & appointment booking',
        'Direct Google Meet & calendar integration with zero no-shows',
        'Executive CRM pipeline with deal value tracking',
      ],
      benefits: [
        'Attract enterprise decision-makers ready to invest',
        'Pre-qualify buyer budgets before getting on the phone',
        '100% full ownership of all domain assets and code',
      ],
      pricingTiers: [
        {
          id: 'tier-c1',
          name: 'Consulting Starter',
          price: 1200,
          description: 'For independent advisors and boutique consultancies establishing high-authority client acquisition.',
          features: ['Custom 1-page authority funnel', 'Calendar booking integration', 'Basic email follow-up sequence', 'Mobile responsive engineering'],
        },
        {
          id: 'tier-c2',
          name: 'Growth Retainer Machine',
          price: 2800,
          description: 'Our flagship system uniting WhatsApp AI, multi-touch nurture, and executive CRM.',
          features: ['Complete conversion funnel & proposal room', 'Trilingual WhatsApp closer (<45s replies)', 'Connected CRM pipeline with deal stages', 'Google & Meta ad set architecture', 'Executive strategy session with Ghazi Wazir'],
          recommended: true,
        },
        {
          id: 'tier-c3',
          name: 'Enterprise Advisory OS',
          price: 4800,
          description: 'Full custom digital infrastructure for multi-partner firms and international consultancies.',
          features: ['Multi-funnel architecture for 3+ service lines', 'Client intake portal & contract e-sign', 'Dedicated engineering sprint & ongoing CRO', 'Private Cloud SQL / Firestore sync'],
        },
      ],
      faqItems: [
        { question: 'How quickly does this funnel generate bookings?', answer: 'Most advisory clients receive qualified bookings within 48 to 72 hours of ad and search traffic activation.' },
        { question: 'Can the WhatsApp agent speak multiple languages?', answer: 'Yes! It natively qualifies prospects in English, Arabic, and Urdu, matching the client timezone and tone.' },
      ],
      visits: 1840,
      leads: 64,
      won: 9,
      conversionRate: 14.1,
      published: true,
      featured: true,
      status: 'active',
      createdAt: '2026-09-15',
    },
    {
      id: 'fnl-2',
      slug: 'clinic-booking',
      name: 'Automated Clinic & Patient Booking Funnel',
      serviceCategory: 'Healthcare & Aesthetic Clinics',
      targetAudience: 'Private Clinics, Dental Centers, Aesthetic Practices & Doctors',
      headline: 'Fill Practice Appointment Slots With Zero No-Shows On Autopilot',
      subheadline: 'An intelligent medical booking funnel and 24/7 WhatsApp concierge that triages patient needs, answers FAQs, and books confirmed slots with upfront deposit collection.',
      heroHighlight: '< 45s Patient Response Time',
      badge: 'Healthcare & Clinics',
      ctaText: 'Book Clinic Growth Demo',
      accentColor: 'emerald',
      deliverables: [
        'High-converting patient booking landing page',
        'Automated intake questionnaire & triage flow',
        '24/7 WhatsApp patient assistant (FAQ + bookings)',
        'Automated 24h and 1h SMS/WhatsApp reminders',
      ],
      benefits: [
        'Virtually eliminate costly patient no-shows',
        'Free up front-desk staff from answering repetitive questions',
        'Capture after-hours and weekend patient inquiries instantly',
      ],
      pricingTiers: [
        {
          id: 'tier-cl1',
          name: 'Clinic Launch',
          price: 800,
          description: 'Essential automated appointment booking for single-provider practices.',
          features: ['Mobile-optimized booking page', 'Google Calendar integration', 'Automated reminder messages', 'Intake form sync'],
        },
        {
          id: 'tier-cl2',
          name: 'Premier Practice OS',
          price: 1800,
          description: 'Complete patient acquisition system with 24/7 WhatsApp AI receptionist.',
          features: ['Multi-doctor booking calendar', 'WhatsApp AI patient receptionist (EN/AR/UR)', 'Deposit payment integration (Stripe)', 'No-show recovery automation', 'Monthly patient analytics report'],
          recommended: true,
        },
        {
          id: 'tier-cl3',
          name: 'Hospital & Multi-Location',
          price: 3500,
          description: 'Enterprise healthcare solution for multi-branch clinics and medical groups.',
          features: ['Multi-location doctor routing', 'EHR/EMR webhook integration', 'Custom HIPAA/GDPR compliance layout', 'Dedicated account manager'],
        },
      ],
      faqItems: [
        { question: 'Does this reduce our front-desk workload?', answer: 'Yes, clinics report up to 70% reduction in phone inquiries because the AI handles appointment booking and FAQs.' },
        { question: 'Can patients pay a booking deposit?', answer: 'Yes, Stripe and credit card gateways can be toggled on to require a refundable or non-refundable deposit.' },
      ],
      visits: 2150,
      leads: 92,
      won: 18,
      conversionRate: 19.6,
      published: true,
      featured: true,
      status: 'active',
      createdAt: '2026-09-20',
    },
    {
      id: 'fnl-3',
      slug: 'ecommerce-checkout',
      name: 'High-AOV E-Commerce & 1-Click Upsell Funnel',
      serviceCategory: 'E-Commerce & DTC Brands',
      targetAudience: 'Online Retailers, DTC Brands & High-Growth Shopify Stores',
      headline: 'Skyrocket Average Order Value (AOV) With Frictionless 1-Click Upsells',
      subheadline: 'Stop relying on slow generic product pages. We build sub-second loading sales pages, post-purchase order bumps, and automated WhatsApp abandoned cart recovery.',
      heroHighlight: '+38% Higher Cart Value',
      badge: 'E-Commerce & DTC',
      ctaText: 'Audit My Store Funnel',
      accentColor: 'purple',
      deliverables: [
        'Conversion-optimized custom product sales page',
        'Post-purchase 1-click upsell and downsell architecture',
        'Abandoned cart recovery via automated WhatsApp & email',
        'Stripe, Apple Pay & PayPal multi-currency checkout',
      ],
      benefits: [
        'Boost customer lifetime value without increasing ad spend',
        'Recover up to 28% of abandoned shopping carts',
        'Sub-second page speeds that improve Meta ad ROAS',
      ],
      pricingTiers: [
        {
          id: 'tier-ec1',
          name: 'Hero Product Funnel',
          price: 1500,
          description: 'Single high-converting hero product page with order bump and upsell.',
          features: ['High-speed custom product page', '1-click post-purchase upsell', 'Stripe checkout integration', 'Mobile checkout speed audit'],
        },
        {
          id: 'tier-ec2',
          name: 'Scale & ROAS Accelerator',
          price: 2900,
          description: 'Complete e-commerce sales engine with WhatsApp cart recovery and split testing.',
          features: ['Full funnel with upsells & downsells', 'WhatsApp & email cart abandonment workflows', 'A/B split testing capability', 'Meta Ads pixel & server-side CAPI tracking', 'AOV multiplier consulting'],
          recommended: true,
        },
        {
          id: 'tier-ec3',
          name: 'Omnichannel Brand OS',
          price: 5200,
          description: 'Enterprise multi-sku checkout architecture with global multi-currency.',
          features: ['Multi-currency international checkout', 'ERP/Inventory sync webhooks', 'VIP customer loyalty automation', 'Dedicated conversion engineer'],
        },
      ],
      faqItems: [
        { question: 'Does this integrate with our existing Shopify or WooCommerce store?', answer: 'Yes! The funnels can run on a custom subdomain (e.g. shop.yourdomain.com) and push orders directly to your fulfillment warehouse.' },
        { question: 'How do post-purchase upsells work?', answer: 'The customer enters payment once; additional complementary offers are accepted with a single click without re-entering card info.' },
      ],
      visits: 3400,
      leads: 120,
      won: 24,
      conversionRate: 20.0,
      published: true,
      featured: true,
      status: 'active',
      createdAt: '2026-09-25',
    },
    {
      id: 'fnl-4',
      slug: 'saas-growth',
      name: 'B2B SaaS & Digital Product Growth Engine',
      serviceCategory: 'SaaS & Web Applications',
      targetAudience: 'Software Founders, Tech Startups & SaaS Products',
      headline: 'Accelerate SaaS Free Trial-to-Paid Conversions On Autopilot',
      subheadline: 'Engineered for software companies that need to explain technical value fast, guide users to an "Aha!" moment, and automate activation email sequences.',
      heroHighlight: '42% Higher Activation Rate',
      badge: 'SaaS & Digital Products',
      ctaText: 'Explore SaaS Architecture',
      accentColor: 'blue',
      deliverables: [
        'Interactive product feature showcase & UX wireframes',
        'Frictionless free trial signup & onboarding flow',
        'Usage-triggered email nurture and trial expiry countdown',
        'Tiered pricing matrix with monthly/annual billing toggle',
      ],
      benefits: [
        'Shorten user time-to-value with clear visual walkthroughs',
        'Prevent trial churn with automated product engagement alerts',
        'Clean developer-friendly API integration endpoints',
      ],
      pricingTiers: [
        {
          id: 'tier-saas1',
          name: 'Seed SaaS Launch',
          price: 2200,
          description: 'For early-stage software products looking to validate product-market fit.',
          features: ['Product landing page with live demo embeds', 'Free trial signup webhook', 'Welcome email sequence', 'SEO & meta tagging'],
        },
        {
          id: 'tier-saas2',
          name: 'Scale & MRR Multiplier',
          price: 4500,
          description: 'Complete acquisition and activation engine for venture or bootstrapped SaaS.',
          features: ['Interactive product tour & pricing matrix', 'Automated onboarding drip based on user events', 'Stripe Billing / Customer Portal setup', 'In-app lead capture widget', 'Full CRM pipeline synchronization'],
          recommended: true,
        },
        {
          id: 'tier-saas3',
          name: 'Enterprise Cloud System',
          price: 8000,
          description: 'Full-stack application development, RBAC security, and scalable database backend.',
          features: ['Custom web app engineering (React/Node)', 'Role-based access & zero-trust security', 'Cloud SQL / PostgreSQL architecture', 'Dedicated CTO advisory sprint'],
        },
      ],
      faqItems: [
        { question: 'Can you build the actual SaaS app too?', answer: 'Yes! Back for Brand LLC architects both the acquisition marketing funnels and custom full-stack cloud software applications.' },
      ],
      visits: 1220,
      leads: 38,
      won: 6,
      conversionRate: 15.8,
      published: true,
      featured: false,
      status: 'active',
      createdAt: '2026-10-02',
    },
    {
      id: 'fnl-5',
      slug: 'local-leads',
      name: 'Local Business SEO & WhatsApp Closer Funnel',
      serviceCategory: 'Local Trades & Professional Services',
      targetAudience: 'Contractors, Law Practices, Real Estate Agents & Local Services',
      headline: 'Dominate Local Google Search & Capture High-Intent Quotes Instantly',
      subheadline: 'Combine local Google Business Profile dominance with an interactive quote calculator and instant WhatsApp routing so you win the job before competitors wake up.',
      heroHighlight: '#1 Local Map Pack Target',
      badge: 'Local Business & Trades',
      ctaText: 'Get Local Growth Plan',
      accentColor: 'orange',
      deliverables: [
        'Geo-targeted local landing page with Google Maps schema',
        'Interactive quote estimator / cost calculator',
        'Click-to-WhatsApp instant quote dispatcher',
        'Automated review generation and reputation engine',
      ],
      benefits: [
        'Rank above competitors in your target geographic zone',
        'Capture leads on mobile in 1 tap directly into WhatsApp',
        'Build overwhelming 5-star social proof on autopilot',
      ],
      pricingTiers: [
        {
          id: 'tier-loc1',
          name: 'Local Spark',
          price: 750,
          description: 'Essential local lead capture and Google Business profile optimization.',
          features: ['Local landing page with click-to-call', 'Google Business Profile audit', 'Lead capture form to email/SMS'],
        },
        {
          id: 'tier-loc2',
          name: 'City Dominator',
          price: 1600,
          description: 'High-converting local quotes engine with instant WhatsApp integration.',
          features: ['Quote estimator & cost calculator', 'WhatsApp instant lead ping & auto-reply', 'Local SEO & keyword citation building', 'Review generation workflow', 'CRM lead tracking'],
          recommended: true,
        },
        {
          id: 'tier-loc3',
          name: 'Multi-Location Enterprise',
          price: 3200,
          description: 'For regional service businesses with 3+ service areas or branches.',
          features: ['Dynamic location pages (City/Zip)', 'Branch-specific lead routing', 'Comprehensive local SEO & Google Ads setup', 'Monthly performance audit'],
        },
      ],
      faqItems: [
        { question: 'Will this help me rank on Google Maps in my city?', answer: 'Yes, we implement complete local schema markup, citation architecture, and Google Business Profile optimization.' },
      ],
      visits: 980,
      leads: 45,
      won: 11,
      conversionRate: 24.4,
      published: true,
      featured: false,
      status: 'active',
      createdAt: '2026-10-06',
    },
  ];

  const initialPaymentSettings: PaymentGatewaySettings = {
    stripe: {
      enabled: true,
      publishableKey: 'pk_live_51Pxxxxxxxxxxxxxxxxxxxxxxxx',
      secretKeyConfigured: true,
      webhookSecretConfigured: true,
      defaultCurrency: 'USD',
      retainerPaymentUrl: 'https://buy.stripe.com/bfb-retainer-500',
      growthPlanPaymentUrl: 'https://buy.stripe.com/bfb-growth-1500',
    },
    paypal: {
      enabled: true,
      clientId: 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
      clientSecretConfigured: true,
      merchantEmail: 'payments@backforbrand.com',
      sandbox: false,
    },
    gccBanks: [
      {
        id: 'gcc-uae-1',
        bankName: 'Emirates NBD',
        country: 'UAE',
        accountTitle: 'Back for Brand LLC - FZ',
        iban: 'AE070260001020304050607',
        swiftBic: 'EBILAEADXXX',
        currency: 'AED',
        supportedNetworks: ['CBUAE Direct', 'Wire'],
        instructions: 'For UAE Dirham (AED) or USD local transfers within UAE or GCC. Reference deal/invoice ID in description.',
        active: true,
      },
      {
        id: 'gcc-ksa-1',
        bankName: 'Al Rajhi Bank (مصرف الراجحي)',
        country: 'Saudi Arabia',
        accountTitle: 'Back for Brand Corporate',
        iban: 'SA4480000123456789012345',
        swiftBic: 'RJHISARIXXX',
        currency: 'SAR',
        supportedNetworks: ['Mada', 'Wire'],
        instructions: 'Instant local SAR transfer via Mada / SARIE instant payment system across all Saudi banks.',
        active: true,
      },
      {
        id: 'gcc-bhd-1',
        bankName: 'National Bank of Bahrain (NBB)',
        country: 'Bahrain',
        accountTitle: 'Back for Brand W.L.L',
        iban: 'BH29NBOB00001122334455',
        swiftBic: 'NBOBBHBMXXX',
        currency: 'BHD',
        supportedNetworks: ['BenefitPay', 'Wire'],
        instructions: 'Instant BenefitPay Fawri+ transfer or GCC IBAN. Instant settlement with zero hold.',
        active: true,
      },
      {
        id: 'gcc-qtr-1',
        bankName: 'Qatar National Bank (QNB)',
        country: 'Qatar',
        accountTitle: 'Back for Brand Global',
        iban: 'QA12QNBA00001234567890',
        swiftBic: 'QNBAQAQAXXX',
        currency: 'QAR',
        supportedNetworks: ['QPay', 'Wire'],
        instructions: 'QNB instant local and regional GCC transfers.',
        active: true,
      },
    ],
    pakistaniBanks: [
      {
        id: 'pk-meezan-1',
        bankName: 'Meezan Bank Ltd (The Premier Islamic Bank)',
        accountTitle: 'Ghazi Wazir / Back for Brand',
        accountNumber: '01020304050607',
        iban: 'PK82MEZN0001020304050607',
        raastId: '923001234567',
        branchName: 'DHA Phase 5 Branch',
        branchCode: '0102',
        currency: 'PKR',
        serviceType: 'IBFT / Raast',
        instructions: 'Instant Raast Payment (Zero Fee) using Raast ID: 923001234567 or IBFT using IBAN. Available 24/7/365 across all 1Link Pakistani banks.',
        active: true,
      },
      {
        id: 'pk-alfalah-1',
        bankName: 'Bank Alfalah Islamic',
        accountTitle: 'Back for Brand Technologies',
        accountNumber: '550198273645',
        iban: 'PK36ALFH5501982736450001',
        raastId: '923007654321',
        branchName: 'Main Boulevard Gulberg',
        branchCode: '5501',
        currency: 'PKR',
        serviceType: 'Freelance Remittance (PRC)',
        instructions: 'State Bank of Pakistan Home Remittance & IT Export proceeds (Eligible for Form-R & PRC certificate).',
        active: true,
      },
      {
        id: 'pk-sadapay-1',
        bankName: 'SadaBiz / SadaPay EMI',
        accountTitle: 'Ghazi Wazir (Founder)',
        accountNumber: '03001234567',
        iban: 'PK91SADA0000000300123456',
        raastId: '03001234567',
        currency: 'PKR',
        serviceType: 'IBFT / Raast',
        instructions: 'SadaPay to SadaPay instant transfer, or 1Link Raast ID: 03001234567. Accepts client invoice payments.',
        active: true,
      },
      {
        id: 'pk-nayapay-1',
        bankName: 'NayaPay EMI',
        accountTitle: 'Back for Brand Digital',
        accountNumber: '03009876543',
        iban: 'PK12NAYA0000000300987654',
        raastId: '03009876543',
        currency: 'PKR',
        serviceType: 'Corporate Digital',
        instructions: 'NayaPay Nayatag: @backforbrand. Instant 1Link IBFT and digital wallet clearance.',
        active: true,
      },
    ],
    internationalWire: [
      {
        id: 'wire-wise-1',
        provider: 'Wise Multi-Currency',
        accountTitle: 'Back for Brand LLC',
        accountNumber: '9876543210',
        routingNumberAba: '084108966',
        swiftBic: 'TRWUS33XXX',
        bankName: 'Community Federal Savings Bank / Wise Inc.',
        bankAddress: 'New York, NY, USA',
        supportedCurrencies: ['USD', 'EUR', 'GBP'],
        instructions: 'For US clients (ACH or FedWire with 0 fee) and European clients via SEPA IBAN.',
        active: true,
      },
      {
        id: 'wire-payoneer-1',
        provider: 'Payoneer Global',
        accountTitle: 'Back for Brand LLC (Ghazi Wazir)',
        accountNumber: '401928374650',
        routingNumberAba: '026073150',
        swiftBic: 'CITIUS33XXX',
        bankName: 'First Century Bank / Citibank N.A.',
        supportedCurrencies: ['USD', 'CAD', 'GBP'],
        instructions: 'Payoneer Global Receiving Account for enterprise invoices and marketplace payouts.',
        active: true,
      },
      {
        id: 'wire-elevate-1',
        provider: 'Elevate Pay',
        accountTitle: 'Ghazi Wazir',
        accountNumber: '7728190345',
        routingNumberAba: '124001545',
        bankName: 'Bangor Savings Bank (FDIC Insured)',
        supportedCurrencies: ['USD'],
        instructions: 'Direct US ACH & Wire account for international founders, backed by US FDIC insurance.',
        active: true,
      },
    ],
    crypto: {
      enabled: true,
      usdtTrc20Address: 'TYrN8xQp9vZ2jL5w4m7k1s3h6b8f0a9c2e',
      usdtErc20Address: '0x71C941Dbf52157d60DEBfa60181b5d69116e00Ab',
      instructions: 'Send exact invoice amount in USDT (TRC-20 recommended for <$1 network fee). Confirmed within 60 seconds.',
    },
  };

  const initialPaymentProofs: PaymentProofSubmission[] = [
    {
      id: 'prf-001',
      clientName: 'Bab Al-Khaleej Consultant',
      clientEmail: 'office@babalkhaleej.bh',
      clientPhone: '+973 1700 0000',
      dealId: 'proj-1',
      amount: 5000,
      currency: 'USD',
      paymentMethod: 'gcc_bank',
      paymentMethodLabel: 'Emirates NBD (UAE IBAN Wire)',
      transactionReference: 'ENBD-TX-8829104',
      receiptNote: 'Enterprise retainers advance cleared via Emirates NBD wire transfer.',
      status: 'verified',
      submittedAt: '2026-10-18 11:20 AM',
      verifiedAt: '2026-10-18 11:35 AM',
      verifiedBy: 'Ghazi Wazir (CEO)',
    },
    {
      id: 'prf-002',
      clientName: 'Ali Traders',
      clientEmail: 'ali@traderscorp.com',
      clientPhone: '923001234567',
      dealId: 'proj-2',
      amount: 1200,
      currency: 'USD',
      paymentMethod: 'pakistani_bank',
      paymentMethodLabel: 'Meezan Bank Ltd (Raast IBFT)',
      transactionReference: 'MEZN-RST-991204',
      receiptNote: 'E-commerce funnel 50% deposit paid via Raast ID 923001234567. Attached screenshot.',
      status: 'pending_verification',
      submittedAt: 'Today 09:40 AM',
    },
  ];

  const initialCampaigns: AdCampaign[] = [
    {
      id: 'cmp-meta-1',
      platform: 'meta',
      campaignName: 'B2B Consulting & Retainer Scaling Q4',
      objective: 'leads',
      status: 'active',
      budgetDaily: 65,
      targetAudience: 'Agency Founders, Managing Directors, Practice Owners ($1M+ ARR)',
      geoTargets: ['United States (Florida focus)', 'UAE (Dubai/Abu Dhabi)', 'Saudi Arabia (Riyadh)', 'United Kingdom'],
      adCopy: {
        headline: 'Stop Losing 60% of Your Web Inquiries to Delayed Replies',
        primaryText: 'Back for Brand builds autonomous client acquisition machines: high-converting funnels, trilingual WhatsApp AI closer replying in <45s, and executive CRM with zero lead leakage. Claim your free growth architecture.',
        ctaText: 'Claim Free Strategy Blueprint',
        format: 'single_image',
      },
      targetFunnelSlug: 'consulting-growth',
      targetFunnelName: 'High-Ticket Consulting & Advisory Funnel',
      trackingUtm: 'https://backforbrand.com/?funnel=consulting-growth&utm_source=meta-ads&utm_medium=paid-cpc&utm_campaign=b2b-scaling',
      leadsGenerated: 42,
      spendTotal: 840,
      roas: '4.8x',
      requiresCeoApproval: false,
      approvedByCeo: true,
      createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
      launchedAt: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
    },
    {
      id: 'cmp-google-1',
      platform: 'google',
      campaignName: 'High-Intent [Funnel Agency & WhatsApp AI] Search',
      objective: 'leads',
      status: 'ready_to_launch',
      budgetDaily: 50,
      targetAudience: 'Active Searchers for sales funnels, AI chatbots, and CRM automation',
      geoTargets: ['United States', 'Canada', 'GCC Countries'],
      adCopy: {
        headline: 'Autonomous Funnels & 24/7 AI WhatsApp Closer | Back for Brand',
        primaryText: 'Turn clicks into paying clients around the clock. Complete conversion architecture with trilingual WhatsApp booking agent and executive CRM. 100% asset ownership.',
        ctaText: 'Get Free Strategy Plan',
        format: 'responsive_search',
      },
      keywords: [
        '[high ticket funnels]',
        '[whatsapp ai closer]',
        '[sales funnel agency florida]',
        '"ai booking agent"',
        '"crm pipeline automation"',
      ],
      negativeKeywords: ['free funnel template', 'cheap website', 'internship', 'jobs'],
      targetFunnelSlug: 'clinic-booking',
      targetFunnelName: 'Automated Clinic & Patient Booking Funnel',
      trackingUtm: 'https://backforbrand.com/?funnel=clinic-booking&utm_source=google-ads&utm_medium=paid-search&utm_campaign=search-intent',
      leadsGenerated: 18,
      spendTotal: 320,
      roas: '3.9x',
      requiresCeoApproval: true,
      approvedByCeo: true,
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    },
    {
      id: 'cmp-meta-2',
      platform: 'meta',
      campaignName: 'E-Commerce 1-Click Upsell & Cart Recovery Funnel',
      objective: 'sales',
      status: 'pending_approval',
      budgetDaily: 120,
      targetAudience: 'DTC Brands, Shopify Store Owners, E-Commerce Directors',
      geoTargets: ['United States', 'United Kingdom', 'Australia'],
      adCopy: {
        headline: 'Skyrocket Average Order Value (AOV) by +38% with 1-Click Upsells',
        primaryText: 'Generic product pages bleed margin. We build sub-second loading checkout funnels with post-purchase order bumps and automated WhatsApp cart recovery.',
        ctaText: 'Audit My Store Funnel',
        format: 'carousel',
      },
      targetFunnelSlug: 'ecommerce-checkout',
      targetFunnelName: 'High-AOV E-Commerce & 1-Click Upsell Funnel',
      trackingUtm: 'https://backforbrand.com/?funnel=ecommerce-checkout&utm_source=meta-ads&utm_medium=paid-cpc&utm_campaign=ecom-upsell',
      leadsGenerated: 0,
      spendTotal: 0,
      roas: '0x',
      requiresCeoApproval: true,
      approvedByCeo: false,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ];

  const initialSocialGuides: SocialPageGuide[] = [
    {
      id: 'soc-meta',
      platform: 'facebook',
      platformName: 'Meta Business Suite (Facebook & Instagram)',
      status: 'created',
      handle: '@backforbrand',
      bioTemplate: 'Autonomous Sales Funnels, 24/7 WhatsApp AI Booking Agents & Executive CRM. Florida, USA | Claim your free growth plan below 👇',
      suggestedPillars: ['Conversion Architecture', 'AI WhatsApp Automation', 'Client Transformations', 'CEO Insights'],
      checklist: [
        { id: 'c1', label: 'Create Meta Business Manager Account', done: true },
        { id: 'c2', label: 'Link Instagram Professional + WhatsApp Number', done: true },
        { id: 'c3', label: 'Install Meta Pixel on Funnel & Dashboard', done: true },
        { id: 'c4', label: 'Configure Automated Welcome Messenger Bot', done: true },
      ],
    },
    {
      id: 'soc-linkedin',
      platform: 'linkedin',
      platformName: 'LinkedIn Company Page',
      status: 'created',
      handle: 'linkedin.com/company/back-for-brand',
      bioTemplate: 'Back for Brand LLC | Engineering high-converting funnels, AI chatbots, and automated business operating systems for high-growth enterprises.',
      suggestedPillars: ['B2B Sales Velocity', 'Fractional Systems', 'Case Studies (Bab Al-Khaleej)'],
      checklist: [
        { id: 'l1', label: 'Create LinkedIn Organization Page', done: true },
        { id: 'l2', label: 'Add Founder Ghazi Wazir as Lead Executive', done: true },
        { id: 'l3', label: 'Deploy Custom Action Button ("Visit Website")', done: true },
        { id: 'l4', label: 'Post Weekly Thought Leadership Case Studies', done: false },
      ],
    },
    {
      id: 'soc-tiktok',
      platform: 'tiktok',
      platformName: 'TikTok for Business',
      status: 'created',
      handle: '@backforbrand',
      bioTemplate: 'We replace 5 disconnected tools with 1 automated AI business machine. Link in bio to book your free strategy call! 🚀',
      suggestedPillars: ['Under-45s AI Replies', 'Funnel Teardowns', 'Behind the Code'],
      checklist: [
        { id: 't1', label: 'Switch to TikTok Business Account', done: true },
        { id: 't2', label: 'Add Verified Website URL in Bio', done: true },
        { id: 't3', label: 'Setup TikTok Event Pixel for Funnels', done: false },
        { id: 't4', label: 'Deploy First 3 Short-Form Video Hooks', done: true },
      ],
    },
    {
      id: 'soc-youtube',
      platform: 'youtube',
      platformName: 'YouTube Channel & VSL Hub',
      status: 'created',
      handle: 'youtube.com/@backforbrand',
      bioTemplate: 'Official channel of Back for Brand LLC. In-depth funnel breakdowns, AI automation tutorials, and live client case studies by Ghazi Wazir.',
      suggestedPillars: ['Complete Funnel Teardowns', 'Client Case Studies', 'System Architecture Walkthroughs'],
      checklist: [
        { id: 'y1', label: 'Create Brand Channel with 4K Banner & Logo', done: true },
        { id: 'y2', label: 'Upload 10-Minute Video Sales Letter (VSL)', done: true },
        { id: 'y3', label: 'Add UTM Tracking Links to Video Descriptions', done: true },
        { id: 'y4', label: 'Embed YouTube Videos into Dedicated Funnels', done: true },
      ],
    },
    {
      id: 'soc-gmb',
      platform: 'gmb',
      platformName: 'Google Business Profile (GMB)',
      status: 'created',
      handle: 'Back for Brand LLC (Florida, USA)',
      bioTemplate: 'Top-rated software and growth engineering firm in Florida. Serving clients across North America, Europe, and the GCC.',
      suggestedPillars: ['Local Reviews', 'Office Updates', 'Direct Strategy Booking'],
      checklist: [
        { id: 'g1', label: 'Verify Business Address in Florida, USA', done: true },
        { id: 'g2', label: 'Add Direct Strategy Session Booking Link', done: true },
        { id: 'g3', label: 'Setup 5-Star Review Generation Flow', done: true },
        { id: 'g4', label: 'Add Photos of Dashboard OS & Client Projects', done: true },
      ],
    },
    {
      id: 'soc-twitter',
      platform: 'twitter',
      platformName: 'X (Twitter) Company Page',
      status: 'created',
      handle: '@backforbrand',
      bioTemplate: 'Autonomous growth machines for high-ticket companies. Led by @ghaziwazir. Code, copy, and AI pipelines.',
      suggestedPillars: ['Build in Public', 'Revenue Metrics', 'AI Agent Breakthroughs'],
      checklist: [
        { id: 'x1', label: 'Claim @backforbrand Handle', done: true },
        { id: 'x2', label: 'Pin High-Converting Teardown Thread', done: true },
        { id: 'x3', label: 'Automate Lead Magnet DMs via Webhook', done: false },
      ],
    },
  ];

  const initialSocialPosts: SocialPostPlan[] = [
    {
      id: 'post-1',
      platform: 'linkedin',
      title: 'Why Most Service Businesses Bleed 60% of Inbound Leads',
      content: `Did you know the average agency takes over 4 hours to reply to an inbound quote request?\n\nBy that time, your prospect has already Googled two competitors.\n\nAt Back for Brand LLC, we engineered an autonomous WhatsApp AI agent that replies in < 45 seconds in English, Arabic, and Urdu, qualifies buyer budgets, and books a Google Meet slot directly on your calendar.\n\nOne connected machine beats six separate tools every single time.`,
      hashtags: ['#B2BGrowth', '#Funnels', '#AIAgents', '#CEO'],
      targetFunnelSlug: 'consulting-growth',
      utmLink: 'https://backforbrand.com/?funnel=consulting-growth&utm_source=linkedin&utm_medium=organic&utm_campaign=lead-bleed-post',
      status: 'scheduled',
      scheduledDate: 'Tomorrow at 09:00 AM',
      clicks: 42,
    },
    {
      id: 'post-2',
      platform: 'instagram',
      title: 'Before & After: Medical Aesthetic Booking Funnel (Zero No-Shows)',
      content: `Private practices and cosmetic clinics don't need another generic website — they need a patient booking engine.\n\nHere is how our client Bab Al-Khaleej deployed zero-friction patient intake with 24/7 WhatsApp triage, leading to a 3.4x surge in confirmed appointments.\n\nTap the link in bio to claim your free clinic growth audit! 🏥`,
      hashtags: ['#MedicalAesthetics', '#ClinicGrowth', '#PatientIntake', '#DigitalHealth'],
      targetFunnelSlug: 'clinic-booking',
      utmLink: 'https://backforbrand.com/?funnel=clinic-booking&utm_source=instagram&utm_medium=organic&utm_campaign=clinic-casestudy',
      status: 'scheduled',
      scheduledDate: 'Friday at 01:00 PM',
      clicks: 86,
    },
    {
      id: 'post-3',
      platform: 'twitter',
      title: 'The Modern Revenue Stack: Funnel + AI Closer + CRM',
      content: `Stop paying $800/month for Zapier, Calendly, Typeform, and separate bot tools.\n\nDeploy one unified Business Machine OS:\n✔ Sub-second landing pages\n✔ Trilingual WhatsApp closer (<45s)\n✔ Executive CRM with lead scoring\n✔ 100% asset and code ownership\n\nLink below for our free breakdown.`,
      hashtags: ['#BuildInPublic', '#SaaS', '#GrowthEngine'],
      targetFunnelSlug: 'consulting-growth',
      utmLink: 'https://backforbrand.com/?funnel=consulting-growth&utm_source=x-twitter&utm_medium=organic&utm_campaign=stack-thread',
      status: 'published',
      scheduledDate: 'Published Yesterday',
      clicks: 124,
    },
  ];

  const initialCeoApprovals: CeoApprovalItem[] = [
    {
      id: 'appr-1',
      type: 'ad_campaign_launch',
      title: 'Meta Ads Launch: E-Commerce 1-Click Upsell ($120/day)',
      details: 'Services team finalized copy, creative angles, and Shopify funnel integration. Target budget: $120/day ($3,600/month allocation). Requires CEO authorization.',
      entityName: 'Meta Ads: E-Commerce 1-Click Upsell',
      amount: 3600,
      currency: 'USD',
      requestedBy: 'Tariq Mansoor (Services Manager)',
      status: 'pending',
      urgency: 'high',
      submittedAt: 'Today 08:45 AM',
      associatedEntityId: 'cmp-meta-2',
    },
    {
      id: 'appr-2',
      type: 'proposal_dispatch',
      title: 'Commercial Proposal: $4,800 Enterprise Advisory OS for Apex Logistics UAE',
      details: 'Custom scope of work with 3-funnel architecture, trilingual WhatsApp closer, and Emirates NBD direct wire settlement.',
      entityName: 'Apex Logistics UAE (Tariq Al-Mansoor)',
      amount: 4800,
      currency: 'USD',
      requestedBy: 'Sara Ahmed (Sales & CRM Rep)',
      status: 'pending',
      urgency: 'critical',
      submittedAt: 'Today 09:10 AM',
      associatedEntityId: 'lead-1',
    },
    {
      id: 'appr-3',
      type: 'milestone_signoff',
      title: 'Deliverable Sign-Off: Bab Al-Khaleej CRM Pipeline & Analytics',
      details: 'Milestone 4 completed on schedule. Ready for client acceptance and final milestone retainer release ($5,000).',
      entityName: 'Bab Al-Khaleej Business Consultant',
      amount: 5000,
      currency: 'USD',
      requestedBy: 'Tariq Mansoor (Services Manager)',
      status: 'approved',
      urgency: 'normal',
      submittedAt: 'Yesterday 14:00 PM',
      decidedAt: 'Yesterday 14:30 PM',
      decisionNote: 'Verified and approved by Ghazi Wazir (CEO). Client deliverables on-track.',
    },
    {
      id: 'appr-4',
      type: 'agent_action',
      title: 'Autonomous Retainer Pitch: WhatsApp Agent to Noor Fashion ($1,500)',
      details: 'Noor Fashion qualified with 88% intent score on WhatsApp. Agent proposes auto-dispatching the $1,500 kickoff retainer link.',
      entityName: 'Noor Fashion (Creative Director)',
      amount: 1500,
      currency: 'USD',
      requestedBy: 'WhatsApp Booking Agent AI',
      status: 'pending',
      urgency: 'normal',
      submittedAt: 'Today 10:20 AM',
    },
  ];

  const initialCeoSettings: CeoNotificationSettings = {
    ceoEmail: 'backforbrandllc@gmail.com',
    ceoPhone: '+923001234567',
    emailAlertsEnabled: true,
    whatsappAlertsEnabled: true,
    dailyBriefingTime: '09:00 AM (EST)',
    autoEscalateUnapprovedHours: 24,
    highValueThresholdUsd: 1000,
  };

  return {
    channels: initialChannels,
    leads: initialLeads,
    bookings: initialBookings,
    projects: initialProjects,
    whatsappMessages: initialWhatsAppMessages,
    emailThreads: initialEmailThreads,
    agentActions: initialAgentActions,
    agentSettings: initialSettings,
    teamMembers: initialTeam,
    auditLogs: initialAuditLogs,
    automations: initialAutomations,
    automationLogs: initialAutomationLogs,
    funnels: initialFunnels,
    paymentSettings: initialPaymentSettings,
    paymentProofs: initialPaymentProofs,
    campaigns: initialCampaigns,
    socialGuides: initialSocialGuides,
    socialPosts: initialSocialPosts,
    ceoApprovals: initialCeoApprovals,
    ceoNotificationSettings: initialCeoSettings,
    baseUrl: 'https://backforbrand.com',
  };
};

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

const STORAGE_KEY_V5 = 'bfb_control_agent_v10';

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'public' | 'machine'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('view') === 'machine' || params.get('tab')) return 'machine';
      }
    } catch {
      // ignore
    }
    return 'public';
  });
  const [machineTab, setMachineTab] = useState<string>('Agent Console');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('bfb_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore
    }
    return 'dark';
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [newLeadsCount, setNewLeadsCount] = useState<number>(0);
  const [activeFunnelId, setActiveFunnelId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentModalPrefill, setPaymentModalPrefill] = useState<{
    amount?: number;
    currency?: string;
    clientName?: string;
    note?: string;
    method?: string;
  } | null>(null);

  const openPaymentModal = (prefill?: {
    amount?: number;
    currency?: string;
    clientName?: string;
    note?: string;
    method?: string;
  }) => {
    if (prefill) {
      setPaymentModalPrefill(prefill);
    }
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentModalPrefill(null);
  };

  const [state, setState] = useState<{
    channels: ChannelData[];
    leads: Lead[];
    bookings: Booking[];
    projects: ClientProject[];
    whatsappMessages: WhatsAppMessage[];
    emailThreads: EmailThread[];
    agentActions: AgentAction[];
    agentSettings: AgentSettings;
    teamMembers: UserProfile[];
    auditLogs: SecurityAuditLog[];
    automations: AutomationRule[];
    automationLogs: AutomationExecutionLog[];
    funnels: ServiceFunnel[];
    paymentSettings: PaymentGatewaySettings;
    paymentProofs: PaymentProofSubmission[];
    campaigns: AdCampaign[];
    socialGuides: SocialPageGuide[];
    socialPosts: SocialPostPlan[];
    ceoApprovals: CeoApprovalItem[];
    ceoNotificationSettings: CeoNotificationSettings;
    baseUrl: string;
  }>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_V5);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.leads) && Array.isArray(parsed.teamMembers)) {
          const initial = initialDemoData();
          return {
            ...initial,
            ...parsed,
            funnels: Array.isArray(parsed.funnels) && parsed.funnels.length > 0 ? parsed.funnels : initial.funnels,
            automations: Array.isArray(parsed.automations) && parsed.automations.length > 0 ? parsed.automations : initial.automations,
            automationLogs: Array.isArray(parsed.automationLogs) && parsed.automationLogs.length > 0 ? parsed.automationLogs : initial.automationLogs,
            paymentSettings: parsed.paymentSettings ? { ...initial.paymentSettings, ...parsed.paymentSettings } : initial.paymentSettings,
            paymentProofs: Array.isArray(parsed.paymentProofs) ? parsed.paymentProofs : initial.paymentProofs,
            campaigns: Array.isArray(parsed.campaigns) && parsed.campaigns.length > 0 ? parsed.campaigns : initial.campaigns,
            socialGuides: Array.isArray(parsed.socialGuides) && parsed.socialGuides.length > 0 ? parsed.socialGuides : initial.socialGuides,
            socialPosts: Array.isArray(parsed.socialPosts) && parsed.socialPosts.length > 0 ? parsed.socialPosts : initial.socialPosts,
            ceoApprovals: Array.isArray(parsed.ceoApprovals) && parsed.ceoApprovals.length > 0 ? parsed.ceoApprovals : initial.ceoApprovals,
            ceoNotificationSettings: parsed.ceoNotificationSettings ? { ...initial.ceoNotificationSettings, ...parsed.ceoNotificationSettings } : initial.ceoNotificationSettings,
          };
        }
      }
    } catch {
      // ignore
    }
    return initialDemoData();
  });

  // Current logged in user (CEO by default with master access, can log out or switch)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return state.teamMembers[0] || null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_V5, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    try {
      localStorage.setItem('bfb_theme', theme);
    } catch {
      // ignore
    }
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
  };

  const clearNotification = () => setNotification(null);
  const resetNewLeadsCount = () => setNewLeadsCount(0);

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>): Lead => {
    const newLead: Lead = {
      ...leadData,
      id: 'lead-' + Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
    };

    // Autonomous Agent Action generated
    const newAction: AgentAction = {
      id: 'act-' + Math.random().toString(36).slice(2, 9),
      type: 'whatsapp_dispatch',
      title: `Welcome & Discovery Outreach for ${newLead.name}`,
      details: `New inbound lead from ${newLead.src} (${newLead.need || 'Growth plan'}). Suggested action: send personalized WhatsApp introduction.`,
      targetClient: newLead.name,
      status: state.agentSettings.autonomousMode ? 'executed' : 'pending_approval',
      autoExecuted: state.agentSettings.autonomousMode,
      timestamp: 'Just now',
    };

    setState((prev) => ({
      ...prev,
      leads: [newLead, ...prev.leads],
      agentActions: [newAction, ...prev.agentActions],
    }));

    setNewLeadsCount((prev) => prev + 1);
    showNotification(`🎯 New Lead captured: "${newLead.name}" (${newLead.src}) → Added to CRM & Agent Queue!`);

    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead),
    }).catch(() => {});

    return newLead;
  };

  const updateLeadStage = (id: string, stage: LeadStage) => {
    setState((prev) => {
      const lead = prev.leads.find((l) => l.id === id);
      const nextLeads = prev.leads.map((l) => (l.id === id ? { ...l, stage } : l));
      let nextProjects = prev.projects;

      // If lead moved to Won and has no existing project, auto-generate client onboarding project!
      if (stage === 'Won' && lead && !prev.projects.some((p) => p.leadId === id || p.clientName === lead.name)) {
        const newProj: ClientProject = {
          id: 'proj-' + Math.random().toString(36).slice(2, 9),
          clientName: lead.name,
          email: lead.email,
          phone: lead.phone,
          serviceType: lead.need || 'Conversion Funnel & Growth Engine',
          status: 'In Progress',
          progress: 10,
          startDate: new Date().toISOString().split('T')[0],
          deadline: new Date(Date.now() + 3600000 * 24 * 14).toISOString().split('T')[0],
          dealValue: lead.val || 1000,
          leadId: id,
          notes: 'Auto-generated on deal won. Client onboarding sprint started.',
          milestones: [
            { id: 'm-auto-1', title: 'Kickoff Call & Requirements Intake', completed: true, dueDate: 'Day 2', category: 'Strategy' },
            { id: 'm-auto-2', title: 'High-Converting Copy & Funnel Wireframe', completed: false, dueDate: 'Day 5', category: 'Design' },
            { id: 'm-auto-3', title: 'Full-Stack Development & AI Integration', completed: false, dueDate: 'Day 10', category: 'Engineering' },
            { id: 'm-auto-4', title: 'QA Testing & Official Launch', completed: false, dueDate: 'Day 14', category: 'Launch & QA' },
          ],
        };
        nextProjects = [newProj, ...prev.projects];
        showNotification(`🎉 Deal Won! Created new client delivery project for "${lead.name}"!`);
      }

      return {
        ...prev,
        leads: nextLeads,
        projects: nextProjects,
      };
    });
  };

  const updateLead = (id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt'>>) => {
    setState((prev) => {
      const existing = prev.leads.find((l) => l.id === id);
      if (!existing) return prev;
      const updated: Lead = {
        ...existing,
        ...updates,
      };

      let nextProjects = prev.projects;
      if (
        updates.stage === 'Won' &&
        existing.stage !== 'Won' &&
        !prev.projects.some((p) => p.leadId === id || p.clientName === updated.name)
      ) {
        const newProj: ClientProject = {
          id: 'proj-' + Math.random().toString(36).slice(2, 9),
          clientName: updated.name,
          email: updated.email,
          phone: updated.phone,
          serviceType: updated.need || 'Conversion Funnel & Growth Engine',
          status: 'In Progress',
          progress: 10,
          startDate: new Date().toISOString().split('T')[0],
          deadline: new Date(Date.now() + 3600000 * 24 * 14).toISOString().split('T')[0],
          dealValue: updated.val || 1000,
          leadId: id,
          notes: 'Auto-generated on deal won from Contacts management. Client onboarding sprint started.',
          milestones: [
            { id: 'm-auto-1', title: 'Kickoff Call & Requirements Intake', completed: true, dueDate: 'Day 2', category: 'Strategy' },
            { id: 'm-auto-2', title: 'High-Converting Copy & Funnel Wireframe', completed: false, dueDate: 'Day 5', category: 'Design' },
            { id: 'm-auto-3', title: 'Full-Stack Development & AI Integration', completed: false, dueDate: 'Day 10', category: 'Engineering' },
            { id: 'm-auto-4', title: 'QA Testing & Official Launch', completed: false, dueDate: 'Day 14', category: 'Launch & QA' },
          ],
        };
        nextProjects = [newProj, ...prev.projects];
        showNotification(`🎉 Deal Won! Created client delivery project for "${updated.name}"!`);
      }

      return {
        ...prev,
        leads: prev.leads.map((l) => (l.id === id ? updated : l)),
        projects: nextProjects,
      };
    });
    showNotification(`Contact "${updates.name || 'record'}" updated successfully`);
  };

  const updateLeadValue = (id: string, val: number) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === id ? { ...l, val } : l)),
    }));
  };

  const deleteLead = (id: string) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.filter((l) => l.id !== id),
    }));
    showNotification('Lead removed from CRM');
  };

  const addBooking = (bookingData: Omit<Booking, 'id'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: 'bk-' + Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
    };

    // Auto-create agent action for 24h reminder
    const reminderAction: AgentAction = {
      id: 'act-' + Math.random().toString(36).slice(2, 9),
      type: 'booking_confirm',
      title: `Send Calendar Invite & Link for ${newBooking.name}`,
      details: `Scheduled on ${newBooking.date} at ${newBooking.time} for "${newBooking.service || 'Strategy Session'}".`,
      targetClient: newBooking.name,
      status: state.agentSettings.autonomousMode ? 'executed' : 'pending_approval',
      autoExecuted: state.agentSettings.autonomousMode,
      timestamp: 'Just now',
    };

    setState((prev) => ({
      ...prev,
      bookings: [newBooking, ...prev.bookings],
      agentActions: [reminderAction, ...prev.agentActions],
    }));

    showNotification(`📅 Session booked for "${newBooking.name}" on ${newBooking.date} at ${newBooking.time}!`);

    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking),
    }).catch(() => {});

    return newBooking;
  };

  const updateBookingStatus = (id: string, st: BookingStatus) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) => (b.id === id ? { ...b, st } : b)),
    }));
    showNotification(`Booking status changed to "${st}"`);
  };

  const deleteBooking = (id: string) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.filter((b) => b.id !== id),
    }));
    showNotification('Booking deleted');
  };

  const updateChannel = (index: number, field: 'visits' | 'spend' | 'target', value: number) => {
    setState((prev) => {
      const nextChannels = [...prev.channels];
      if (nextChannels[index]) {
        nextChannels[index] = {
          ...nextChannels[index],
          [field]: Math.max(0, value || 0),
        };
      }
      return { ...prev, channels: nextChannels };
    });
  };

  const setBaseUrl = (url: string) => {
    setState((prev) => ({ ...prev, baseUrl: url.trim() }));
    showNotification('Tracking base URL updated');
  };

  const importLeadsFromText = (text: string): number => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    let count = 0;
    const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');

    const lines = trimmed.split(/\r?\n/);
    const newItems: Lead[] = [];

    lines.forEach((line) => {
      const cols = line.split(line.includes('\t') ? '\t' : ',').map((x) => x.replace(/^"|"$/g, '').trim());
      if (cols.length < 3 || /^time/i.test(cols[0])) return;

      const [time, name, email, phone, source, need, message] = cols;
      const key = `${email || name}|${time || ''}`;

      if (state.leads.some((l) => l.key === key)) return;

      const g = slug(source || 'direct');
      let foundIdx = TRAFFIC_SOURCES.findIndex((s) => slug(s) === g);
      if (foundIdx < 0) {
        foundIdx = TRAFFIC_SOURCES.findIndex((s) => g.length > 2 && slug(s).startsWith(g));
      }
      const matchedSource = TRAFFIC_SOURCES[foundIdx < 0 ? TRAFFIC_SOURCES.length - 1 : foundIdx];

      newItems.push({
        id: 'lead-' + Math.random().toString(36).slice(2, 9),
        key,
        name: name || email || 'Imported Lead',
        email: email || '',
        phone: (phone || '').replace(/\D/g, ''),
        src: matchedSource,
        stage: 'New',
        val: 0,
        need: need || 'Imported from Sheet',
        message: message || '',
        createdAt: time || new Date().toISOString(),
      });
      count++;
    });

    if (newItems.length > 0) {
      setState((prev) => ({
        ...prev,
        leads: [...newItems, ...prev.leads],
      }));
      setNewLeadsCount((prev) => prev + count);
      showNotification(`✓ Successfully imported ${count} leads from spreadsheet into CRM!`);
    }

    return count;
  };

  const resetDemoData = () => {
    const demo = initialDemoData();
    setState(demo);
    setNewLeadsCount(0);
    showNotification('Database reset to fresh enterprise control system demo state');
  };

  // WhatsApp dispatch
  const sendWhatsAppMessage = (msgData: Omit<WhatsAppMessage, 'id' | 'timestamp'>) => {
    const newMsg: WhatsAppMessage = {
      ...msgData,
      id: 'wa-' + Math.random().toString(36).slice(2, 9),
      timestamp: 'Just now',
    };
    setState((prev) => ({
      ...prev,
      whatsappMessages: [...prev.whatsappMessages, newMsg],
    }));
    showNotification(`💬 WhatsApp dispatched to ${newMsg.clientName}!`);

    // Clean phone and trigger wa.me in background/new window if phone present
    const cleanPhone = (newMsg.phone || '').replace(/\D/g, '');
    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(newMsg.text)}`, '_blank');
    }
  };

  // Email dispatch
  const sendEmail = (emailData: Omit<EmailThread, 'id' | 'timestamp'>) => {
    const newThread: EmailThread = {
      ...emailData,
      id: 'em-' + Math.random().toString(36).slice(2, 9),
      timestamp: 'Just now',
    };
    setState((prev) => ({
      ...prev,
      emailThreads: [newThread, ...prev.emailThreads],
    }));
    showNotification(`📧 Email sent to ${newThread.clientName} (${newThread.email})!`);
  };

  // Project Management
  const createProject = (projData: Omit<ClientProject, 'id'>): ClientProject => {
    const newProj: ClientProject = {
      ...projData,
      id: 'proj-' + Math.random().toString(36).slice(2, 9),
    };
    setState((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
    showNotification(`🚀 New project initiated for "${newProj.clientName}"!`);
    return newProj;
  };

  const updateProjectStatus = (id: string, status: ProjectStatus, progress?: number) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status,
            progress: progress !== undefined ? progress : p.progress,
          };
        }
        return p;
      }),
    }));
    showNotification(`Project status updated to "${status}"`);
  };

  const toggleProjectMilestone = (projectId: string, milestoneId: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id === projectId) {
          const nextMilestones = p.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          const completedCount = nextMilestones.filter((m) => m.completed).length;
          const nextProgress = Math.round((completedCount / nextMilestones.length) * 100);
          return {
            ...p,
            milestones: nextMilestones,
            progress: nextProgress,
          };
        }
        return p;
      }),
    }));
  };

  // Agent Actions
  const approveAgentAction = (id: string) => {
    setState((prev) => {
      const action = prev.agentActions.find((a) => a.id === id);
      if (!action) return prev;

      // Execute corresponding real action
      if (action.type === 'whatsapp_dispatch') {
        const lead = prev.leads.find((l) => l.name === action.targetClient);
        if (lead && lead.phone) {
          const cleanPhone = lead.phone.replace(/\D/g, '');
          window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${lead.name}, this is Back for Brand following up on your digital growth request.`)}`, '_blank');
        }
      }

      return {
        ...prev,
        agentActions: prev.agentActions.map((a) =>
          a.id === id ? { ...a, status: 'executed' } : a
        ),
      };
    });
    showNotification('✓ Agent Action Approved & Executed');
  };

  const dismissAgentAction = (id: string) => {
    setState((prev) => ({
      ...prev,
      agentActions: prev.agentActions.map((a) =>
        a.id === id ? { ...a, status: 'dismissed' } : a
      ),
    }));
    showNotification('Agent action dismissed');
  };

  const updateAgentSettings = (newSettings: Partial<AgentSettings>) => {
    setState((prev) => ({
      ...prev,
      agentSettings: { ...prev.agentSettings, ...newSettings },
    }));
    showNotification('Agent operational settings updated');
  };

  // Natural Language Control Agent Interpreter
  const executeAgentCommand = async (command: string): Promise<{ success: boolean; reply: string }> => {
    const lower = command.toLowerCase();

    // 1. Move lead status command: e.g. "move hamza store to won" or "close deal ali traders"
    const matchedLead = state.leads.find((l) => lower.includes(l.name.toLowerCase()));
    if (matchedLead) {
      if (lower.includes('won') || lower.includes('close') || lower.includes('win')) {
        updateLeadStage(matchedLead.id, 'Won');
        return {
          success: true,
          reply: `Executed: Moved "${matchedLead.name}" to Won ($${matchedLead.val || 0}). Generated client onboarding project automatically.`,
        };
      }
      if (lower.includes('proposal')) {
        updateLeadStage(matchedLead.id, 'Proposal');
        return { success: true, reply: `Executed: Moved "${matchedLead.name}" to Proposal stage.` };
      }
      if (lower.includes('booked')) {
        updateLeadStage(matchedLead.id, 'Booked');
        return { success: true, reply: `Executed: Moved "${matchedLead.name}" to Booked stage.` };
      }
    }

    // 2. Schedule booking command: e.g. "schedule call with client X tomorrow at 11"
    if (lower.includes('schedule') || lower.includes('book') || lower.includes('appointment')) {
      const clientName = matchedLead ? matchedLead.name : 'VIP Prospect';
      const tomorrow = new Date(Date.now() + 3600000 * 24).toISOString().split('T')[0];
      const newBk = addBooking({
        name: clientName,
        email: matchedLead?.email || 'client@business.com',
        phone: matchedLead?.phone || '+1 555 0192',
        date: tomorrow,
        time: '11:00',
        service: 'Executive Strategy Session',
        durationMinutes: 45,
        st: 'Confirmed',
        notes: `Scheduled via Agent Console command: "${command}"`,
      });
      return {
        success: true,
        reply: `Booked: Scheduled session for "${newBk.name}" on ${newBk.date} at 11:00 AM. Meet link generated and calendar synced.`,
      };
    }

    // 3. WhatsApp dispatch command: e.g. "whatsapp ali traders that funnel is ready"
    if (lower.includes('whatsapp') || lower.includes('message')) {
      const target = matchedLead ? matchedLead : state.leads[0];
      sendWhatsAppMessage({
        clientName: target.name,
        phone: target.phone || '923001234567',
        direction: 'outbound',
        text: `Salam ${target.name}, Back for Brand here. Your digital deliverables are on track. Let us know if you need any adjustments!`,
        status: 'sent',
      });
      return {
        success: true,
        reply: `Dispatched: Sent WhatsApp message to "${target.name}" (${target.phone}) and opened live chat.`,
      };
    }

    // 4. Email dispatch command
    if (lower.includes('email') || lower.includes('mail')) {
      const target = matchedLead ? matchedLead : state.leads[0];
      sendEmail({
        clientName: target.name,
        email: target.email || 'client@example.com',
        subject: 'Project Sprint Update & Next Steps - Back for Brand',
        body: `Dear ${target.name},\n\nWe wanted to share an update on your deliverables. All milestones are progressing on schedule.\n\nWarm regards,\nBack for Brand Services Operations`,
        direction: 'outbound',
        status: 'sent',
      });
      return {
        success: true,
        reply: `Dispatched: Email sent to "${target.name}" (${target.email}). Added to client thread history.`,
      };
    }

    // 5. CEO Report / Briefing dispatch command
    if (lower.includes('ceo') || lower.includes('report') || lower.includes('briefing')) {
      const channelTarget = lower.includes('whatsapp') ? 'whatsapp' : lower.includes('email') ? 'email' : 'both';
      await dispatchCeoBriefing(channelTarget, `Dispatched via Agent Console command: "${command}"`);
      return {
        success: true,
        reply: `Executive Briefing Dispatched: Formatted telemetry, revenue metrics ($${state.leads.filter((l) => l.stage === 'Won').reduce((s, l) => s + (l.val || 0), 0).toLocaleString()}), and pending approvals sent to CEO Ghazi Wazir via ${channelTarget.toUpperCase()}.`,
      };
    }

    // 6. Ads / Campaign launch command
    if (lower.includes('ad') || lower.includes('campaign') || lower.includes('meta') || lower.includes('google')) {
      const readyCamp = state.campaigns.find((c) => c.status === 'ready_to_launch' || c.status === 'pending_approval');
      if (readyCamp) {
        if (lower.includes('launch') || lower.includes('start') || lower.includes('activate')) {
          await launchCampaign(readyCamp.id);
          return {
            success: true,
            reply: `Campaign Deployed: Launched "${readyCamp.campaignName}" on ${readyCamp.platform.toUpperCase()} with daily budget $${readyCamp.budgetDaily}/day. Attribution active in CRM.`,
          };
        }
      }
      return {
        success: true,
        reply: `Campaigns Status: ${state.campaigns.length} campaigns configured (${state.campaigns.filter((c) => c.status === 'active').length} Active, ${state.campaigns.filter((c) => c.status === 'ready_to_launch').length} Ready to Launch). Check "Ads & Social Launchpad" tab to manage.`,
      };
    }

    // 7. Query / Summary
    if (lower.includes('status') || lower.includes('summary') || lower.includes('kpi') || lower.includes('revenue')) {
      const wonTotal = state.leads.filter((l) => l.stage === 'Won').reduce((s, l) => s + (l.val || 0), 0);
      const activeProjectsCount = state.projects.filter((p) => p.status === 'In Progress' || p.status === 'Active Support').length;
      return {
        success: true,
        reply: `Current Operational Summary: Total Leads: ${state.leads.length} | Revenue Won: $${wonTotal.toLocaleString()} | Active Client Projects: ${activeProjectsCount} | Open Bookings: ${state.bookings.length} | Pending CEO Approvals: ${state.ceoApprovals.filter((a) => a.status === 'pending').length} | Active Ad Spend: $${state.campaigns.filter((c) => c.status === 'active').reduce((s, c) => s + c.budgetDaily, 0)}/day.`,
      };
    }

    // Default Fallback
    return {
      success: true,
      reply: `Agent processed command: "${command}". All services, calendar, and CRM states synchronized. Try commands like: "Send daily report to CEO", "Launch Meta Ads campaign", "Schedule call with Hamza Store", or "Move Ali Traders to Won".`,
    };
  };

  // Automations Workflow Engine
  const addAutomation = (ruleData: Omit<AutomationRule, 'id' | 'executionsCount' | 'createdAt'>): AutomationRule => {
    const newRule: AutomationRule = {
      ...ruleData,
      id: 'auto-' + Math.random().toString(36).slice(2, 9),
      executionsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setState((prev) => ({
      ...prev,
      automations: [newRule, ...prev.automations],
    }));
    showNotification(`⚡ New Automation created: "${newRule.name}"!`);
    return newRule;
  };

  const updateAutomation = (id: string, updates: Partial<AutomationRule>) => {
    setState((prev) => ({
      ...prev,
      automations: prev.automations.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
    showNotification('Automation workflow updated');
  };

  const toggleAutomationActive = (id: string) => {
    setState((prev) => {
      const rule = prev.automations.find((a) => a.id === id);
      const nextActive = rule ? !rule.active : true;
      return {
        ...prev,
        automations: prev.automations.map((a) =>
          a.id === id ? { ...a, active: nextActive } : a
        ),
      };
    });
    showNotification('Automation status toggled');
  };

  const deleteAutomation = (id: string) => {
    setState((prev) => ({
      ...prev,
      automations: prev.automations.filter((a) => a.id !== id),
    }));
    showNotification('Automation removed');
  };

  const triggerAutomation = async (
    automationId: string,
    targetLeadId?: string
  ): Promise<{ success: boolean; executedSteps: number; summary: string }> => {
    const rule = state.automations.find((a) => a.id === automationId);
    if (!rule) {
      return { success: false, executedSteps: 0, summary: 'Automation rule not found' };
    }

    const targetLead = targetLeadId
      ? state.leads.find((l) => l.id === targetLeadId)
      : state.leads[0];

    const contactName = targetLead ? targetLead.name : 'Inbound Prospect';
    const contactEmail = targetLead?.email || 'contact@client.com';
    const contactCompany = targetLead?.company || targetLead?.name || 'Company';

    let stepsCount = 0;

    // 1. If rule has email sequence, dispatch immediate email step to emailThreads
    if (rule.emailSequence && rule.emailSequence.length > 0) {
      const firstStep = rule.emailSequence[0];
      const interpolatedSubject = firstStep.subject
        .replace(/{{name}}/g, contactName)
        .replace(/{{company}}/g, contactCompany);
      const interpolatedBody = firstStep.body
        .replace(/{{name}}/g, contactName)
        .replace(/{{company}}/g, contactCompany);

      const newEmail: EmailThread = {
        id: 'em-' + Math.random().toString(36).slice(2, 9),
        clientName: contactName,
        email: contactEmail,
        subject: `[Automated] ${interpolatedSubject}`,
        body: interpolatedBody,
        direction: 'outbound',
        status: 'sent',
        timestamp: 'Just now',
      };

      stepsCount = rule.emailSequence.length;

      setState((prev) => ({
        ...prev,
        emailThreads: [newEmail, ...prev.emailThreads],
      }));
    }

    // 2. If rule has targetStage, update lead status
    if (targetLead && rule.targetStage) {
      updateLead(targetLead.id, {
        stage: rule.targetStage,
        statusNote: rule.statusNote || `Auto-updated by workflow: "${rule.name}"`,
        tags: rule.tagsToAdd
          ? Array.from(new Set([...(targetLead.tags || []), ...rule.tagsToAdd]))
          : targetLead.tags,
      });
    }

    // 3. Record Execution Log
    const newLog: AutomationExecutionLog = {
      id: 'log-auto-' + Date.now(),
      automationId: rule.id,
      automationName: rule.name,
      targetContact: `${contactName} (${contactCompany})`,
      targetEmail: contactEmail,
      actionSummary: `Triggered: ${rule.actionType.replace(/_/g, ' ')}${rule.targetStage ? ` → Stage set to ${rule.targetStage}` : ''}${stepsCount > 0 ? ` (${stepsCount}-step email sequence queued)` : ''}`,
      status: 'executed',
      timestamp: 'Just now',
    };

    // 4. Update Rule stats
    setState((prev) => ({
      ...prev,
      automations: prev.automations.map((a) =>
        a.id === rule.id
          ? {
              ...a,
              executionsCount: a.executionsCount + 1,
              lastExecutedAt: 'Just now',
            }
          : a
      ),
      automationLogs: [newLog, ...prev.automationLogs],
    }));

    const summary = `Executed automation "${rule.name}" for ${contactName}. ${stepsCount} email steps queued, status updated.`;
    showNotification(`⚡ ${summary}`);

    return {
      success: true,
      executedSteps: stepsCount,
      summary,
    };
  };

  // Funnels & Multi-Page Engine
  const addFunnel = (funnelData: Omit<ServiceFunnel, 'id' | 'visits' | 'leads' | 'won' | 'createdAt'>): ServiceFunnel => {
    const newFunnel: ServiceFunnel = {
      ...funnelData,
      id: 'fnl-' + Math.random().toString(36).slice(2, 9),
      visits: 0,
      leads: 0,
      won: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setState((prev) => ({
      ...prev,
      funnels: [newFunnel, ...prev.funnels],
    }));
    showNotification(`🚀 New Service Funnel created: "${newFunnel.name}"!`);
    return newFunnel;
  };

  const updateFunnel = (id: string, updates: Partial<ServiceFunnel>) => {
    setState((prev) => ({
      ...prev,
      funnels: prev.funnels.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
    showNotification('Service funnel settings updated');
  };

  const toggleFunnelPublished = (id: string) => {
    setState((prev) => {
      const target = prev.funnels.find((f) => f.id === id);
      const nextPublished = target ? !target.published : true;
      return {
        ...prev,
        funnels: prev.funnels.map((f) => (f.id === id ? { ...f, published: nextPublished } : f)),
      };
    });
    showNotification('Funnel publish status toggled');
  };

  const deleteFunnel = (id: string) => {
    setState((prev) => ({
      ...prev,
      funnels: prev.funnels.filter((f) => f.id !== id),
    }));
    showNotification('Service funnel removed');
  };

  const duplicateFunnel = (id: string): ServiceFunnel => {
    const source = state.funnels.find((f) => f.id === id);
    if (!source) throw new Error('Funnel not found');

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const cloned: ServiceFunnel = {
      ...JSON.parse(JSON.stringify(source)),
      id: 'fnl-' + Math.random().toString(36).slice(2, 9),
      name: `${source.name} (Copy)`,
      slug: `${source.slug}-copy-${randomSuffix}`,
      visits: 0,
      leads: 0,
      won: 0,
      conversionRate: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft' as const,
    };

    setState((prev) => ({
      ...prev,
      funnels: [cloned, ...prev.funnels],
    }));

    showNotification(`Duplicated service funnel: "${cloned.name}"`);
    return cloned;
  };

  const recordFunnelVisit = (funnelIdOrSlug: string) => {
    setState((prev) => ({
      ...prev,
      funnels: prev.funnels.map((f) =>
        f.id === funnelIdOrSlug || f.slug === funnelIdOrSlug
          ? { ...f, visits: (f.visits || 0) + 1 }
          : f
      ),
    }));
  };

  // CEO Security & Role-Based Access Control
  const isModuleAllowed = (moduleName: string): boolean => {
    if (!currentUser || !isAuthenticated) return false;
    if (currentUser.role === 'ceo' || currentUser.allowedModules.includes('*')) return true;
    if (moduleName === 'Integration Guide' || moduleName === 'Setup Guide' || moduleName === 'Integration') return true;
    if (
      moduleName === 'Payment Gateways & Banking' ||
      moduleName === 'Banking' ||
      moduleName === 'Payments' ||
      moduleName === 'Payment Gateways'
    ) {
      return (
        currentUser.role === 'services_manager' ||
        currentUser.allowedModules.includes('Payment Gateways & Banking') ||
        currentUser.allowedModules.includes('Banking')
      );
    }
    if (
      moduleName === 'Ads & Social Launchpad' ||
      moduleName === 'Ads' ||
      moduleName === 'Social' ||
      moduleName === 'Meta Ads' ||
      moduleName === 'Google Ads'
    ) {
      return (
        currentUser.role === 'services_manager' ||
        currentUser.role === 'sales_rep' ||
        currentUser.allowedModules.includes('Ads & Social Launchpad')
      );
    }
    if (
      moduleName === 'CEO Reports & Approvals' ||
      moduleName === 'CEO Approvals' ||
      moduleName === 'Approvals'
    ) {
      return currentUser.allowedModules.includes('CEO Reports & Approvals');
    }
    if (
      (moduleName === 'Template Gallery' || moduleName === 'Templates' || moduleName === 'Templates Library') &&
      (currentUser.allowedModules.includes('Template Gallery') ||
        currentUser.allowedModules.includes('Templates') ||
        currentUser.allowedModules.includes('Templates Library'))
    ) {
      return true;
    }
    if (
      moduleName === 'Funnel Performance' ||
      moduleName === 'Funnels Performance' ||
      moduleName === 'Funnel Analytics'
    ) {
      return (
        currentUser.role === 'services_manager' ||
        currentUser.role === 'sales_rep' ||
        currentUser.allowedModules.includes('Funnel Performance') ||
        currentUser.allowedModules.includes('Analytics') ||
        currentUser.allowedModules.includes('Funnels & Pages')
      );
    }
    return currentUser.allowedModules.includes(moduleName);
  };

  const login = (email: string, passcode: string): { success: boolean; error?: string } => {
    const normalized = email.trim().toLowerCase();
    const found = state.teamMembers.find(
      (m) => m.email.toLowerCase() === normalized && m.passcode === passcode.trim()
    );

    if (found) {
      if (!found.active) {
        const alertLog: SecurityAuditLog = {
          id: 'log-sec-' + Date.now(),
          userName: found.name,
          userRole: found.role,
          action: `Blocked login attempt on suspended account (${found.email}). Access denied.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ip: 'Client Gate',
          status: 'alert',
        };
        setState((prev) => ({
          ...prev,
          auditLogs: [alertLog, ...prev.auditLogs],
        }));
        return { success: false, error: 'This access account has been suspended by the CEO.' };
      }

      const updatedUser: UserProfile = {
        ...found,
        lastLogin: 'Just now (Active)',
      };

      setCurrentUser(updatedUser);
      setIsAuthenticated(true);

      const newLog: SecurityAuditLog = {
        id: 'log-sec-' + Date.now(),
        userName: found.name,
        userRole: found.role,
        action: `Authenticated successfully (${found.title}). Dashboard session unlocked.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ip: 'Active Session',
        status: 'success',
      };

      setState((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.map((m) => (m.id === found.id ? updatedUser : m)),
        auditLogs: [newLog, ...prev.auditLogs],
      }));

      showNotification(`🔐 Welcome back, ${found.name}! Logged in as ${found.title}.`);
      return { success: true };
    }

    const failedLog: SecurityAuditLog = {
      id: 'log-sec-' + Date.now(),
      userName: 'Unknown / Unauthorized',
      userRole: 'client_viewer',
      action: `Failed authentication attempt for email: "${email}". Invalid passcode.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ip: 'Security Gate',
      status: 'alert',
    };

    setState((prev) => ({
      ...prev,
      auditLogs: [failedLog, ...prev.auditLogs],
    }));

    return {
      success: false,
      error: 'Invalid credentials. Please enter valid authorized email and passcode.',
    };
  };

  const logout = () => {
    if (currentUser) {
      const exitLog: SecurityAuditLog = {
        id: 'log-sec-' + Date.now(),
        userName: currentUser.name,
        userRole: currentUser.role,
        action: `Logged out. Session closed and locked.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ip: 'Dashboard Lock',
        status: 'warning',
      };
      setState((prev) => ({
        ...prev,
        auditLogs: [exitLog, ...prev.auditLogs],
      }));
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    showNotification('Session terminated. CEO & Team Dashboard secured.');
  };

  const switchActiveRole = (role: UserRole) => {
    const target = state.teamMembers.find((m) => m.role === role) || state.teamMembers[0];
    setCurrentUser(target);
    setIsAuthenticated(true);

    const switchLog: SecurityAuditLog = {
      id: 'log-sec-' + Date.now(),
      userName: target.name,
      userRole: target.role,
      action: `Profile switched to: ${target.name} (${target.title}). Scope: ${target.role === 'ceo' ? 'All Areas' : target.allowedModules.join(', ')}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ip: 'Role Switcher',
      status: 'warning',
    };

    setState((prev) => ({
      ...prev,
      auditLogs: [switchLog, ...prev.auditLogs],
    }));

    showNotification(`Active profile switched to: ${target.name} (${target.title})`);
  };

  const updateUserPermissions = (userId: string, allowedModules: string[]) => {
    const member = state.teamMembers.find((m) => m.id === userId);
    const memberName = member ? member.name : 'User';

    const log: SecurityAuditLog = {
      id: 'log-sec-' + Date.now(),
      userName: currentUser ? currentUser.name : 'CEO',
      userRole: 'ceo',
      action: `CEO modified allocated permissions for ${memberName}: [${allowedModules.join(', ')}]`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ip: 'CEO Control Center',
      status: 'warning',
    };

    setState((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m) =>
        m.id === userId ? { ...m, allowedModules } : m
      ),
      auditLogs: [log, ...prev.auditLogs],
    }));

    // If current user is the one modified, sync current user state
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, allowedModules } : null));
    }

    showNotification(`Allocated business areas updated for ${memberName}`);
  };

  const toggleUserActiveStatus = (userId: string) => {
    const member = state.teamMembers.find((m) => m.id === userId);
    if (!member) return;
    if (member.role === 'ceo') {
      showNotification('Cannot suspend primary CEO account.');
      return;
    }

    const updatedActive = !member.active;
    const log: SecurityAuditLog = {
      id: 'log-sec-' + Date.now(),
      userName: currentUser ? currentUser.name : 'CEO',
      userRole: 'ceo',
      action: `CEO ${updatedActive ? 're-activated' : 'suspended'} account access for ${member.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ip: 'CEO Control Center',
      status: updatedActive ? 'success' : 'alert',
    };

    setState((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m) =>
        m.id === userId ? { ...m, active: updatedActive } : m
      ),
      auditLogs: [log, ...prev.auditLogs],
    }));

    showNotification(`Account ${updatedActive ? 'Activated' : 'Suspended'}: ${member.name}`);
  };

  const resetUserPassword = (userId: string, newPasscode: string) => {
    const member = state.teamMembers.find((m) => m.id === userId);
    if (!member) return;

    const log: SecurityAuditLog = {
      id: 'log-sec-' + Date.now(),
      userName: currentUser ? currentUser.name : 'CEO',
      userRole: 'ceo',
      action: `CEO reset access passcode for account: ${member.name} (${member.email})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ip: 'CEO Control Center',
      status: 'warning',
    };

    setState((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m) =>
        m.id === userId ? { ...m, passcode: newPasscode } : m
      ),
      auditLogs: [log, ...prev.auditLogs],
    }));

    showNotification(`Passcode updated for ${member.name}`);
  };

  const emergencyLockdown = () => {
    // Keep CEO logged in or reset to locked CEO session
    const ceo = state.teamMembers.find((m) => m.role === 'ceo') || state.teamMembers[0];
    const log: SecurityAuditLog = {
      id: 'log-sec-' + Date.now(),
      userName: ceo.name,
      userRole: 'ceo',
      action: `🚨 CEO EXECUTED EMERGENCY SECURITY LOCKDOWN: Terminated all non-CEO sessions. Enforced master access control.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ip: 'CEO Master Key',
      status: 'alert',
    };

    setState((prev) => ({
      ...prev,
      auditLogs: [log, ...prev.auditLogs],
    }));

    setCurrentUser(ceo);
    setIsAuthenticated(true);
    showNotification('🚨 Emergency lockdown executed: Master CEO control enforced.');
  };

  const addTeamMember = (memberData: Omit<UserProfile, 'id' | 'lastLogin'>) => {
    const newMember: UserProfile = {
      ...memberData,
      id: 'usr-' + Math.random().toString(36).slice(2, 9),
      lastLogin: 'Never',
    };

    const log: SecurityAuditLog = {
      id: 'log-sec-' + Date.now(),
      userName: currentUser ? currentUser.name : 'CEO',
      userRole: 'ceo',
      action: `CEO provisioned new authorized account: ${newMember.name} (${newMember.title}) with [${newMember.allowedModules.join(', ')}] allocated.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ip: 'CEO Control Center',
      status: 'success',
    };

    setState((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newMember],
      auditLogs: [log, ...prev.auditLogs],
    }));
    showNotification(`New staff profile created: ${newMember.name} (${newMember.title})`);
  };

  const deleteTeamMember = (userId: string) => {
    const member = state.teamMembers.find((m) => m.id === userId);
    if (!member) return;
    if (member.role === 'ceo') {
      showNotification('Cannot delete primary CEO account.');
      return;
    }

    const log: SecurityAuditLog = {
      id: 'log-sec-' + Date.now(),
      userName: currentUser ? currentUser.name : 'CEO',
      userRole: 'ceo',
      action: `CEO revoked and deleted account: ${member.name} (${member.email})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ip: 'CEO Control Center',
      status: 'alert',
    };

    setState((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((m) => m.id !== userId),
      auditLogs: [log, ...prev.auditLogs],
    }));
    showNotification('Team account removed from security directory');
  };

  // Global Banking & Payment Methods
  const updatePaymentSettings = (settings: Partial<PaymentGatewaySettings>) => {
    setState((prev) => ({
      ...prev,
      paymentSettings: {
        ...prev.paymentSettings,
        ...settings,
        stripe: settings.stripe ? { ...prev.paymentSettings.stripe, ...settings.stripe } : prev.paymentSettings.stripe,
        paypal: settings.paypal ? { ...prev.paymentSettings.paypal, ...settings.paypal } : prev.paymentSettings.paypal,
        crypto: settings.crypto ? { ...prev.paymentSettings.crypto, ...settings.crypto } : prev.paymentSettings.crypto,
      },
    }));
    showNotification('Payment gateway and international banking settings updated');
  };

  const addPaymentProof = (proof: Omit<PaymentProofSubmission, 'id' | 'submittedAt' | 'status'>): PaymentProofSubmission => {
    const newProof: PaymentProofSubmission = {
      ...proof,
      id: 'prf-' + Math.random().toString(36).slice(2, 9),
      submittedAt: 'Just now',
      status: 'pending_verification',
    };

    setState((prev) => ({
      ...prev,
      paymentProofs: [newProof, ...prev.paymentProofs],
    }));

    showNotification(`Payment proof submitted for ${proof.clientName} ($${proof.amount} ${proof.currency})`);
    return newProof;
  };

  const verifyPaymentProof = (id: string, status: 'verified' | 'rejected') => {
    const target = state.paymentProofs.find((p) => p.id === id);
    if (!target) return;

    const verifiedBy = currentUser ? `${currentUser.name} (${currentUser.title})` : 'Ghazi Wazir (CEO)';
    const verifiedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setState((prev) => {
      let updatedLeads = prev.leads;
      if (status === 'verified') {
        const leadMatch = prev.leads.find(
          (l) =>
            l.id === target.leadId ||
            (target.clientEmail && l.email && l.email.toLowerCase() === target.clientEmail.toLowerCase()) ||
            l.name.toLowerCase() === target.clientName.toLowerCase()
        );
        if (leadMatch) {
          updatedLeads = prev.leads.map((l) =>
            l.id === leadMatch.id ? { ...l, stage: 'Won' as const, val: target.amount || l.val } : l
          );
        }
      }

      return {
        ...prev,
        leads: updatedLeads,
        paymentProofs: prev.paymentProofs.map((p) =>
          p.id === id
            ? {
                ...p,
                status,
                verifiedAt,
                verifiedBy,
              }
            : p
        ),
      };
    });

    if (status === 'verified') {
      showNotification(`Payment verified for ${target.clientName} ($${target.amount})! Deal marked as WON.`);
    } else {
      showNotification(`Payment proof for ${target.clientName} was rejected.`);
    }
  };

  const deletePaymentProof = (id: string) => {
    setState((prev) => ({
      ...prev,
      paymentProofs: prev.paymentProofs.filter((p) => p.id !== id),
    }));
    showNotification('Payment submission record removed');
  };

  // Ads & Social Launchpad methods
  const addCampaign = (campData: Omit<AdCampaign, 'id' | 'leadsGenerated' | 'spendTotal' | 'roas' | 'createdAt'>): AdCampaign => {
    const newCamp: AdCampaign = {
      ...campData,
      id: 'cmp-' + Math.random().toString(36).slice(2, 9),
      leadsGenerated: 0,
      spendTotal: 0,
      roas: '0x',
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      campaigns: [newCamp, ...prev.campaigns],
    }));
    showNotification(`New Ad Campaign created: "${newCamp.campaignName}" (${newCamp.platform.toUpperCase()})!`);
    fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCamp),
    }).catch(() => {});
    return newCamp;
  };

  const updateCampaign = (id: string, updates: Partial<AdCampaign>) => {
    setState((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    showNotification('Campaign updated');
  };

  const launchCampaign = async (id: string): Promise<{ success: boolean; message: string }> => {
    const target = state.campaigns.find((c) => c.id === id);
    if (!target) return { success: false, message: 'Campaign not found' };

    setState((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'active' as const,
              launchedAt: new Date().toISOString(),
              approvedByCeo: true,
            }
          : c
      ),
    }));

    showNotification(`🚀 Campaign "${target.campaignName}" is LIVE and attributing into CRM!`);
    fetch(`/api/campaigns/${id}/launch`, { method: 'POST' }).catch(() => {});
    return { success: true, message: `Campaign "${target.campaignName}" is live!` };
  };

  const deleteCampaign = (id: string) => {
    setState((prev) => ({
      ...prev,
      campaigns: prev.campaigns.filter((c) => c.id !== id),
    }));
    showNotification('Campaign deleted');
  };

  const addSocialPost = (postData: Omit<SocialPostPlan, 'id'>): SocialPostPlan => {
    const newPost: SocialPostPlan = {
      ...postData,
      id: 'post-' + Math.random().toString(36).slice(2, 9),
    };
    setState((prev) => ({
      ...prev,
      socialPosts: [newPost, ...prev.socialPosts],
    }));
    showNotification(`Social Post scheduled for ${newPost.platform}!`);
    return newPost;
  };

  const toggleSocialChecklist = (platformId: string, checklistId: string) => {
    setState((prev) => ({
      ...prev,
      socialGuides: prev.socialGuides.map((guide) => {
        if (guide.id === platformId) {
          return {
            ...guide,
            checklist: guide.checklist.map((item) =>
              item.id === checklistId ? { ...item, done: !item.done } : item
            ),
          };
        }
        return guide;
      }),
    }));
  };

  // CEO Reports & Approvals methods
  const updateCeoNotificationSettings = (settings: Partial<CeoNotificationSettings>) => {
    setState((prev) => ({
      ...prev,
      ceoNotificationSettings: { ...prev.ceoNotificationSettings, ...settings },
    }));
    showNotification('CEO notification settings updated');
  };

  const createCeoApprovalRequest = (reqData: Omit<CeoApprovalItem, 'id' | 'status' | 'submittedAt'>): CeoApprovalItem => {
    const newReq: CeoApprovalItem = {
      ...reqData,
      id: 'appr-' + Math.random().toString(36).slice(2, 9),
      status: 'pending',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setState((prev) => ({
      ...prev,
      ceoApprovals: [newReq, ...prev.ceoApprovals],
    }));
    showNotification(`New CEO Approval Request queued: "${newReq.title}"!`);
    fetch('/api/ceo/approvals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReq),
    }).catch(() => {});
    return newReq;
  };

  const decideCeoApproval = async (
    id: string,
    decision: 'approved' | 'rejected',
    note?: string
  ): Promise<{ success: boolean; message: string }> => {
    const target = state.ceoApprovals.find((a) => a.id === id);
    if (!target) return { success: false, message: 'Approval item not found' };

    const decidedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const decisionNote = note || `Decision: ${decision.toUpperCase()} by Ghazi Wazir (CEO)`;

    setState((prev) => {
      // If approving an associated campaign, mark it ready to launch or active
      let updatedCampaigns = prev.campaigns;
      if (decision === 'approved' && target.associatedEntityId) {
        updatedCampaigns = prev.campaigns.map((c) =>
          c.id === target.associatedEntityId
            ? { ...c, status: 'ready_to_launch' as const, approvedByCeo: true }
            : c
        );
      }

      // If approving a proposal, advance lead stage to Won or Booked
      let updatedLeads = prev.leads;
      if (decision === 'approved' && target.type === 'proposal_dispatch' && target.associatedEntityId) {
        updatedLeads = prev.leads.map((l) =>
          l.id === target.associatedEntityId ? { ...l, stage: 'Won' as const } : l
        );
      }

      return {
        ...prev,
        campaigns: updatedCampaigns,
        leads: updatedLeads,
        ceoApprovals: prev.ceoApprovals.map((a) =>
          a.id === id
            ? {
                ...a,
                status: decision,
                decidedAt: decidedTime,
                decisionNote,
              }
            : a
        ),
      };
    });

    const msg = `CEO Decision Recorded: ${decision.toUpperCase()} for "${target.title}"!`;
    showNotification(`👑 ${msg}`);
    fetch(`/api/ceo/approvals/${id}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: decision, note: decisionNote }),
    }).catch(() => {});
    return { success: true, message: msg };
  };

  const dispatchCeoBriefing = async (
    channel: 'email' | 'whatsapp' | 'both',
    customNote?: string
  ): Promise<{ success: boolean; message: string; payload?: any }> => {
    try {
      const res = await fetch('/api/ceo/dispatch-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, customNote }),
      });
      const data = await res.json();
      showNotification(`📨 CEO Briefing dispatched to ${channel.toUpperCase()}!`);
      return { success: true, message: data.message, payload: data };
    } catch {
      showNotification('CEO briefing queued for delivery');
      return { success: true, message: 'CEO report prepared and queued.' };
    }
  };

  return (
    <BusinessContext.Provider
      value={{
        campaigns: state.campaigns,
        socialGuides: state.socialGuides,
        socialPosts: state.socialPosts,
        addCampaign,
        updateCampaign,
        launchCampaign,
        deleteCampaign,
        addSocialPost,
        toggleSocialChecklist,
        ceoApprovals: state.ceoApprovals,
        ceoNotificationSettings: state.ceoNotificationSettings,
        updateCeoNotificationSettings,
        createCeoApprovalRequest,
        decideCeoApproval,
        dispatchCeoBriefing,
        paymentSettings: state.paymentSettings,
        paymentProofs: state.paymentProofs,
        updatePaymentSettings,
        addPaymentProof,
        verifyPaymentProof,
        deletePaymentProof,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        paymentModalPrefill,
        openPaymentModal,
        closePaymentModal,
        leads: state.leads,
        bookings: state.bookings,
        channels: state.channels,
        projects: state.projects,
        whatsappMessages: state.whatsappMessages,
        emailThreads: state.emailThreads,
        agentActions: state.agentActions,
        agentSettings: state.agentSettings,
        teamMembers: state.teamMembers,
        auditLogs: state.auditLogs,
        automations: state.automations,
        automationLogs: state.automationLogs,
        addAutomation,
        updateAutomation,
        toggleAutomationActive,
        deleteAutomation,
        triggerAutomation,
        funnels: state.funnels,
        activeFunnelId,
        setActiveFunnelId,
        addFunnel,
        updateFunnel,
        toggleFunnelPublished,
        deleteFunnel,
        duplicateFunnel,
        recordFunnelVisit,
        currentUser,
        isAuthenticated,
        baseUrl: state.baseUrl,
        currentView,
        setCurrentView: (v) => {
          if (v === 'machine') resetNewLeadsCount();
          setCurrentView(v);
        },
        machineTab,
        setMachineTab,
        theme,
        toggleTheme,
        addLead,
        updateLead,
        updateLeadStage,
        updateLeadValue,
        deleteLead,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        updateChannel,
        setBaseUrl,
        importLeadsFromText,
        resetDemoData,
        recentNotification: notification,
        clearNotification,
        newLeadsCountSinceView: newLeadsCount,
        resetNewLeadsCount,
        sendWhatsAppMessage,
        sendEmail,
        createProject,
        updateProjectStatus,
        toggleProjectMilestone,
        approveAgentAction,
        dismissAgentAction,
        executeAgentCommand,
        updateAgentSettings,
        login,
        logout,
        switchActiveRole,
        updateUserPermissions,
        addTeamMember,
        deleteTeamMember,
        toggleUserActiveStatus,
        resetUserPassword,
        emergencyLockdown,
        isModuleAllowed,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
