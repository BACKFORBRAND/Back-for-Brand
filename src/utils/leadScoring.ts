import {
  Lead,
  Booking,
  WhatsAppMessage,
  EmailThread,
  ClientProject,
  ServiceFunnel,
  HotnessTier,
  ScoreFactor,
  LeadScoreBreakdown,
} from '../types/index.ts';

export const FUNNEL_STEP_OPTIONS = [
  'Landing Page Viewed',
  'Video / VSL Watched',
  'Deliverables Selected',
  'Pricing Selected',
  'Application Submitted',
  'Discovery Call Booked',
  'Checkout Initiated',
  'Payment Completed',
] as const;

export interface LeadScoringContext {
  bookings?: Booking[];
  whatsappMessages?: WhatsAppMessage[];
  emailThreads?: EmailThread[];
  projects?: ClientProject[];
  funnels?: ServiceFunnel[];
}

/**
 * Normalizes phone numbers for matching (digits only)
 */
function normalizePhone(p?: string): string {
  if (!p) return '';
  return p.replace(/\D/g, '');
}

/**
 * Normalizes names for fuzzy/loose matching
 */
function normalizeName(n?: string): string {
  if (!n) return '';
  return n.trim().toLowerCase();
}

/**
 * Computes an automated, comprehensive Lead Hotness Score (0-100)
 * based on lifecycle stage, funnel progress, interaction history, recency, and deal profile.
 */
export function calculateLeadScore(
  lead: Lead,
  context: LeadScoringContext = {}
): LeadScoreBreakdown {
  const {
    bookings = [],
    whatsappMessages = [],
    emailThreads = [],
    projects = [],
    funnels = [],
  } = context;

  const factors: ScoreFactor[] = [];
  const leadPhone = normalizePhone(lead.phone);
  const leadEmail = (lead.email || '').trim().toLowerCase();
  const leadName = normalizeName(lead.name);
  const leadCompany = normalizeName(lead.company);

  // 1. FUNNEL PROGRESS & LIFECYCLE STAGE (Max 35)
  let funnelPoints = 0;

  switch (lead.stage) {
    case 'Won':
      funnelPoints += 30;
      factors.push({
        id: 'stage-won',
        label: 'Deal Won / Active Client',
        points: 30,
        category: 'funnel',
        description: 'Lead converted into paying customer',
        positive: true,
      });
      break;
    case 'Booked':
      funnelPoints += 25;
      factors.push({
        id: 'stage-booked',
        label: 'Discovery / Strategy Call Booked',
        points: 25,
        category: 'funnel',
        description: 'Committed to live strategy consultation',
        positive: true,
      });
      break;
    case 'Proposal':
      funnelPoints += 20;
      factors.push({
        id: 'stage-proposal',
        label: 'Proposal Under Review',
        points: 20,
        category: 'funnel',
        description: 'Formal commercial terms issued',
        positive: true,
      });
      break;
    case 'Contacted':
      funnelPoints += 14;
      factors.push({
        id: 'stage-contacted',
        label: 'Direct Dialogue Established',
        points: 14,
        category: 'funnel',
        description: 'Two-way consultation engaged',
        positive: true,
      });
      break;
    case 'New':
      funnelPoints += 8;
      factors.push({
        id: 'stage-new',
        label: 'Inbound Ingestion',
        points: 8,
        category: 'funnel',
        description: 'Newly captured prospect entry',
        positive: true,
      });
      break;
    case 'Lost':
      funnelPoints += 2;
      factors.push({
        id: 'stage-lost',
        label: 'Closed / Dropped Off',
        points: 2,
        category: 'funnel',
        description: 'Stalled opportunity',
        positive: false,
      });
      break;
  }

  // Linked Funnel Architecture Match
  if (lead.funnelId || lead.funnelName) {
    const matchedFunnel = funnels.find(
      (f) => f.id === lead.funnelId || f.name.toLowerCase() === (lead.funnelName || '').toLowerCase()
    );
    const funnelTitle = matchedFunnel?.name || lead.funnelName || 'Service Funnel';
    funnelPoints += 3;
    factors.push({
      id: 'funnel-attributed',
      label: `Attributed to ${funnelTitle.slice(0, 22)}...`,
      points: 3,
      category: 'funnel',
      description: 'Acquired through tracked conversion architecture',
      positive: true,
    });
  }

  // Funnel Step Progression
  if (lead.funnelStep) {
    const step = lead.funnelStep.toLowerCase();
    if (step.includes('payment') || step.includes('checkout') || step.includes('stripe')) {
      funnelPoints += 7;
      factors.push({
        id: 'funnel-step-checkout',
        label: 'Funnel Step: Checkout / Payment',
        points: 7,
        category: 'funnel',
        description: 'Reached purchase authorization stage',
        positive: true,
      });
    } else if (step.includes('application') || step.includes('booked') || step.includes('discovery')) {
      funnelPoints += 5;
      factors.push({
        id: 'funnel-step-app',
        label: 'Funnel Step: High-Ticket Application',
        points: 5,
        category: 'funnel',
        description: 'Completed in-depth qualification intake',
        positive: true,
      });
    } else if (step.includes('pricing') || step.includes('proposal') || step.includes('deliverables')) {
      funnelPoints += 4;
      factors.push({
        id: 'funnel-step-pricing',
        label: 'Funnel Step: Pricing / Deliverables Selection',
        points: 4,
        category: 'funnel',
        description: 'Inspected commercial tiers and deliverables',
        positive: true,
      });
    } else if (step.includes('video') || step.includes('vsl')) {
      funnelPoints += 2;
      factors.push({
        id: 'funnel-step-vsl',
        label: 'Funnel Step: VSL Watched',
        points: 2,
        category: 'funnel',
        description: 'Watched core pitch and proof assets',
        positive: true,
      });
    }
  }

  const cappedFunnelScore = Math.min(35, funnelPoints);

  // 2. INTERACTION HISTORY (Max 35)
  let interactionPoints = 0;
  let whatsappInbound = 0;
  let whatsappOutbound = 0;
  let emailOpened = 0;
  let emailSent = 0;
  let bookingsCount = 0;
  let hasActiveProject = false;

  // Match WhatsApp Messages
  whatsappMessages.forEach((msg) => {
    const msgPhone = normalizePhone(msg.phone);
    const msgClient = normalizeName(msg.clientName);
    const phoneMatch = leadPhone && msgPhone && (leadPhone.includes(msgPhone) || msgPhone.includes(leadPhone));
    const nameMatch = leadName && (msgClient.includes(leadName) || leadName.includes(msgClient));

    if (phoneMatch || nameMatch) {
      if (msg.direction === 'inbound') {
        whatsappInbound++;
      } else {
        whatsappOutbound++;
      }
    }
  });

  if (whatsappInbound > 0) {
    const pts = Math.min(16, whatsappInbound * 8);
    interactionPoints += pts;
    factors.push({
      id: 'wa-inbound',
      label: `${whatsappInbound} Inbound WhatsApp Replies`,
      points: pts,
      category: 'interactions',
      description: 'Direct response from prospect on WhatsApp',
      positive: true,
    });
  }

  if (whatsappOutbound > 0) {
    const pts = Math.min(6, whatsappOutbound * 3);
    interactionPoints += pts;
    factors.push({
      id: 'wa-outbound',
      label: `${whatsappOutbound} WhatsApp Dispatches`,
      points: pts,
      category: 'interactions',
      description: 'Automated/manual messages sent & delivered',
      positive: true,
    });
  }

  // Match Email Threads
  emailThreads.forEach((em) => {
    const emAddr = (em.email || '').toLowerCase().trim();
    const emClient = normalizeName(em.clientName);
    const emailMatch = leadEmail && emAddr && (leadEmail === emAddr || emAddr.includes(leadEmail));
    const nameMatch = leadName && (emClient.includes(leadName) || leadName.includes(emClient));

    if (emailMatch || nameMatch) {
      if (em.status === 'opened' || em.status === 'read') {
        emailOpened++;
      } else {
        emailSent++;
      }
    }
  });

  if (emailOpened > 0) {
    const pts = Math.min(12, emailOpened * 6);
    interactionPoints += pts;
    factors.push({
      id: 'email-opened',
      label: `${emailOpened} Emails Opened`,
      points: pts,
      category: 'interactions',
      description: 'Engaged with email threads and proposals',
      positive: true,
    });
  } else if (emailSent > 0) {
    const pts = Math.min(4, emailSent * 2);
    interactionPoints += pts;
    factors.push({
      id: 'email-sent',
      label: `${emailSent} Emails Dispatched`,
      points: pts,
      category: 'interactions',
      description: 'Email sequence in progress',
      positive: true,
    });
  }

  // Match Bookings
  bookings.forEach((bk) => {
    const bkPhone = normalizePhone(bk.phone);
    const bkEmail = (bk.email || '').toLowerCase().trim();
    const bkName = normalizeName(bk.name);

    const phoneMatch = leadPhone && bkPhone && (leadPhone.includes(bkPhone) || bkPhone.includes(leadPhone));
    const emailMatch = leadEmail && bkEmail && (leadEmail === bkEmail);
    const nameMatch = leadName && (bkName.includes(leadName) || leadName.includes(bkName));

    if (phoneMatch || emailMatch || nameMatch) {
      bookingsCount++;
      if (bk.st === 'Confirmed') {
        interactionPoints += 12;
        factors.push({
          id: `booking-${bk.id}`,
          label: `Confirmed Calendar Session (${bk.date})`,
          points: 12,
          category: 'interactions',
          description: 'Calendar session confirmed with Google Meet link',
          positive: true,
        });
      } else if (bk.st === 'Pending') {
        interactionPoints += 6;
        factors.push({
          id: `booking-${bk.id}`,
          label: `Pending Booking Slot Request`,
          points: 6,
          category: 'interactions',
          description: 'Requested calendar slot awaiting confirmation',
          positive: true,
        });
      }
    }
  });

  // Match Projects
  projects.forEach((proj) => {
    const projName = normalizeName(proj.clientName);
    const nameMatch = leadName && (projName.includes(leadName) || leadName.includes(projName));
    const compMatch = leadCompany && (projName.includes(leadCompany) || leadCompany.includes(projName));

    if (nameMatch || compMatch) {
      hasActiveProject = true;
      interactionPoints += 8;
      factors.push({
        id: `project-${proj.id}`,
        label: `Active Client Project (${proj.serviceType.slice(0, 20)}...)`,
        points: 8,
        category: 'interactions',
        description: `${proj.status} sprint (${proj.progress}% completed)`,
        positive: true,
      });
    }
  });

  // Lead notes or custom logs count as interaction signal
  if (lead.notes && lead.notes.length > 20) {
    interactionPoints += 3;
    factors.push({
      id: 'dossier-notes',
      label: 'Executive Dossier Notes Logged',
      points: 3,
      category: 'interactions',
      description: 'Sales rep or CEO logged strategic intelligence',
      positive: true,
    });
  }

  const cappedInteractionScore = Math.min(35, interactionPoints);

  // 3. RECENCY & ACTIVITY VELOCITY (Max 15)
  let recencyPoints = 0;
  const now = Date.now();
  const leadDate = lead.lastContactedAt ? new Date(lead.lastContactedAt).getTime() : new Date(lead.createdAt).getTime();
  const diffHours = (now - leadDate) / (1000 * 60 * 60);

  if (diffHours <= 24) {
    recencyPoints += 15;
    factors.push({
      id: 'recency-24h',
      label: 'Ultra-Recent Interaction (<24h)',
      points: 15,
      category: 'recency',
      description: 'High velocity engagement within the last 24 hours',
      positive: true,
    });
  } else if (diffHours <= 72) {
    recencyPoints += 10;
    factors.push({
      id: 'recency-72h',
      label: 'Recent Interaction (<3 days)',
      points: 10,
      category: 'recency',
      description: 'Active pipeline velocity within 72 hours',
      positive: true,
    });
  } else if (diffHours <= 168) {
    // 7 days
    recencyPoints += 5;
    factors.push({
      id: 'recency-7d',
      label: 'Active Contact (<7 days)',
      points: 5,
      category: 'recency',
      description: 'Steady touchpoint maintained within the week',
      positive: true,
    });
  } else if (diffHours <= 336) {
    // 14 days
    recencyPoints += 2;
    factors.push({
      id: 'recency-14d',
      label: 'Moderate Touchpoint (<14 days)',
      points: 2,
      category: 'recency',
      description: 'Touching base within two weeks',
      positive: true,
    });
  } else {
    // Stale decay
    recencyPoints -= 5;
    factors.push({
      id: 'recency-stale',
      label: 'Stale Lead (>14 days inactive)',
      points: -5,
      category: 'recency',
      description: 'Lead engagement momentum is cooling down',
      positive: false,
    });
  }

  const boundedRecencyScore = Math.max(0, Math.min(15, recencyPoints));

  // 4. DEAL VALUE & PROFILE INTENT (Max 15)
  let valuePoints = 0;

  // Pipeline Deal Value
  if (lead.val >= 2000) {
    valuePoints += 6;
    factors.push({
      id: 'value-high',
      label: `Enterprise Deal Value ($${lead.val.toLocaleString()})`,
      points: 6,
      category: 'value',
      description: 'Tier-1 enterprise ticket size',
      positive: true,
    });
  } else if (lead.val >= 1000) {
    valuePoints += 4;
    factors.push({
      id: 'value-mid',
      label: `High-Ticket Deal Value ($${lead.val.toLocaleString()})`,
      points: 4,
      category: 'value',
      description: 'High-ticket agency/consultancy retainer',
      positive: true,
    });
  } else if (lead.val >= 400) {
    valuePoints += 2;
    factors.push({
      id: 'value-entry',
      label: `Core Package Value ($${lead.val.toLocaleString()})`,
      points: 2,
      category: 'value',
      description: 'Standard productized service investment',
      positive: true,
    });
  }

  // Acquisition Source Intent
  const src = (lead.src || '').toLowerCase();
  if (src.includes('geo') || src.includes('aeo') || src.includes('ai search')) {
    valuePoints += 4;
    factors.push({
      id: 'src-geo',
      label: 'AI Search (GEO/AEO) Inbound',
      points: 4,
      category: 'value',
      description: 'Highest organic purchase intent from Perplexity / Gemini',
      positive: true,
    });
  } else if (src.includes('whatsapp') || src.includes('referral')) {
    valuePoints += 3;
    factors.push({
      id: 'src-direct',
      label: `${lead.src} High-Trust Inbound`,
      points: 3,
      category: 'value',
      description: 'Direct high-trust channel referral or message',
      positive: true,
    });
  } else if (src.includes('google ads') || src.includes('meta ads')) {
    valuePoints += 2;
    factors.push({
      id: 'src-paid',
      label: `${lead.src} Paid Acquisition`,
      points: 2,
      category: 'value',
      description: 'Attributed from active paid media ad campaigns',
      positive: true,
    });
  }

  // Category Fit
  const category = (lead.category || '').toLowerCase();
  if (category.includes('enterprise')) {
    valuePoints += 3;
    factors.push({
      id: 'cat-enterprise',
      label: 'Enterprise VIP Tier',
      points: 3,
      category: 'value',
      description: 'Strategic account classification',
      positive: true,
    });
  } else if (category.includes('agency') || category.includes('high-ticket')) {
    valuePoints += 2;
    factors.push({
      id: 'cat-agency',
      label: 'High-Ticket Agency Account',
      points: 2,
      category: 'value',
      description: 'Strong ICP product-market fit',
      positive: true,
    });
  }

  // High-Intent Tags
  const highIntentTags = [
    'vip',
    'high intent',
    'stripe active',
    'geo search inbound',
    'decision maker',
    'ready to buy',
    'proposal out',
    'contract sent',
  ];
  const matchedTags = (lead.tags || []).filter((t) =>
    highIntentTags.some((hit) => t.toLowerCase().includes(hit))
  );

  if (matchedTags.length > 0) {
    const pts = Math.min(3, matchedTags.length * 1.5);
    valuePoints += pts;
    factors.push({
      id: 'intent-tags',
      label: `High-Intent Tags (${matchedTags.join(', ')})`,
      points: pts,
      category: 'value',
      description: 'Explicit qualification markers tagged in CRM',
      positive: true,
    });
  }

  const cappedValueScore = Math.min(15, valuePoints);

  // Custom Adjustment (if any manual sales override was set)
  const customAdj = lead.customScoreAdjustment || 0;
  if (customAdj !== 0) {
    factors.push({
      id: 'custom-override',
      label: customAdj > 0 ? `Manual Sales Boost (+${customAdj})` : `Manual Penalty (${customAdj})`,
      points: customAdj,
      category: 'value',
      description: 'Custom override applied by account executive',
      positive: customAdj > 0,
    });
  }

  // Total Score Calculation
  const rawTotal =
    cappedFunnelScore +
    cappedInteractionScore +
    boundedRecencyScore +
    cappedValueScore +
    customAdj;

  const totalScore = Math.max(0, Math.min(100, Math.round(rawTotal)));

  // Tier Classification & Prescriptive Recommendations
  let tier: HotnessTier = 'Cold';
  let tierColor = '#64748b'; // slate
  let tierBadgeBg = 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  let recommendedAction = 'Re-engage via cold revival workflow or nurture via newsletter.';

  if (totalScore >= 85) {
    tier = 'Very Hot';
    tierColor = '#ef4444'; // red/flame
    tierBadgeBg = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    recommendedAction =
      'Immediate priority: Send closing contract or place personal executive call within 1 hour.';
  } else if (totalScore >= 70) {
    tier = 'Hot';
    tierColor = '#f97316'; // amber orange
    tierBadgeBg = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    recommendedAction =
      'High-velocity prospect: Dispatch customized proposal or WhatsApp booking nudge.';
  } else if (totalScore >= 50) {
    tier = 'Warm';
    tierColor = '#eab308'; // yellow / warm gold
    tierBadgeBg = 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30';
    recommendedAction =
      'Nurture actively: Share case study benchmarks and invite to live architecture demo.';
  } else if (totalScore >= 30) {
    tier = 'Cool';
    tierColor = '#06b6d4'; // cyan
    tierBadgeBg = 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
    recommendedAction =
      'Early pipeline: Trigger automated educational email sequence to drive discovery booking.';
  }

  return {
    totalScore,
    tier,
    tierColor,
    tierBadgeBg,
    funnelScore: cappedFunnelScore,
    interactionScore: cappedInteractionScore,
    recencyScore: boundedRecencyScore,
    valueScore: cappedValueScore,
    factors,
    recommendedAction,
    matchedInteractions: {
      whatsappInbound,
      whatsappOutbound,
      emailOpened,
      emailSent,
      bookingsCount,
      hasActiveProject,
    },
  };
}

/**
 * Returns icon symbol for a given tier
 */
export function getHotnessTierIcon(tier: HotnessTier): string {
  switch (tier) {
    case 'Very Hot':
      return '🔥';
    case 'Hot':
      return '⚡';
    case 'Warm':
      return '🌤️';
    case 'Cool':
      return '❄️';
    case 'Cold':
      return '🧊';
  }
}

/**
 * Helper to get tailwind flame/meter color styles
 */
export function getScoreMeterGradient(score: number): string {
  if (score >= 85) return 'from-rose-500 via-red-500 to-amber-500';
  if (score >= 70) return 'from-amber-500 to-yellow-500';
  if (score >= 50) return 'from-yellow-500 to-emerald-500';
  if (score >= 30) return 'from-cyan-500 to-blue-500';
  return 'from-slate-400 to-gray-500';
}
