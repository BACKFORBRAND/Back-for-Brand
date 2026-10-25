import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { calculateLeadScore } from '../src/utils/leadScoring.ts';
import { Lead } from '../src/types/index.ts';

const BASE_URL = 'http://127.0.0.1:3000';

// Global test tokens acquired during tests
let ceoToken = '';
let staffToken = '';
let testUserId = '';

describe('Suite 1: Registration, Login, Logout, Session & Password Management', () => {
  test('TC-AUTH-01: GET /api/health confirms API server is online and healthy', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'healthy');
    assert.ok(data.timestamp);
  });

  test('TC-AUTH-02: POST /api/auth/login rejects incorrect password with 401 and attempts counter', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'backforbrand@gmail.com',
        password: 'invalid-password-attempt',
      }),
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.ok(data.error);
    assert.ok(typeof data.attemptsRemaining === 'number');
  });

  test('TC-AUTH-03: POST /api/auth/login succeeds for CEO and returns Bearer session token', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'backforbrand@gmail.com',
        password: process.env.CEO_DEFAULT_PASSWORD || 'ceo777',
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.token, 'Session token was not issued');
    assert.equal(data.user.role, 'ceo');
    ceoToken = data.token;
  });

  test('TC-AUTH-04: GET /api/auth/me validates active Bearer session', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${ceoToken}` },
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.user.email, 'backforbrand@gmail.com');
  });

  test('TC-AUTH-05: POST /api/auth/users allows CEO to provision new staff account', async () => {
    const uniqueEmail = `staff.${Date.now()}@backforbrand.com`;
    const res = await fetch(`${BASE_URL}/api/auth/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ceoToken}`,
      },
      body: JSON.stringify({
        name: 'New Acquisition Specialist',
        email: uniqueEmail,
        role: 'sales_rep',
        title: 'Acquisition Rep',
        initialPassword: 'temporaryPass123',
        allowedModules: ['CRM Pipeline', 'Contacts', 'WhatsApp AI Agent'],
      }),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.user.id);
    testUserId = data.user.id;
  });

  test('TC-AUTH-06: POST /api/auth/users/:id/reset-password updates password securely via CEO', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/users/${testUserId}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ceoToken}`,
      },
      body: JSON.stringify({ newPassword: 'updatedSecurePass789' }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
  });

  test('TC-AUTH-07: POST /api/auth/logout invalidates the session token on server', async () => {
    // Acquire a throwaway session token
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'backforbrand@gmail.com',
        password: process.env.CEO_DEFAULT_PASSWORD || 'ceo777',
      }),
    });
    const { token: tempToken } = await loginRes.json();
    assert.ok(tempToken);

    // Logout
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tempToken}`,
      },
      body: JSON.stringify({ token: tempToken }),
    });
    assert.equal(logoutRes.status, 200);

    // Verify token is now rejected
    const checkRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${tempToken}` },
    });
    assert.equal(checkRes.status, 401);
  });
});

describe('Suite 2: Protected Routes, Role Permissions & Cross-User Isolation', () => {
  test('TC-RBAC-01: Setup staff token (Services Manager)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'tariq@backforbrand.com',
        password: process.env.SERVICES_DEFAULT_PASSWORD || 'services123',
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    staffToken = data.token;
    assert.ok(staffToken);
  });

  test('TC-RBAC-02: Public team directory /api/auth/team sanitizes credentials', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/team`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.teamMembers));
    for (const m of data.teamMembers) {
      assert.equal(m.passwordHash, undefined);
      assert.equal(m.salt, undefined);
      assert.equal(m.passcode, undefined);
    }
  });

  test('TC-RBAC-03: Non-CEO staff cannot verify payment slips (403 Forbidden)', async () => {
    const res = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
      body: JSON.stringify({ id: 'proof-init-1', status: 'verified' }),
    });
    assert.equal(res.status, 403);
  });

  test('TC-RBAC-04: Non-CEO staff cannot reset other user passwords (403 Forbidden)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/users/usr-ceo/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
      body: JSON.stringify({ newPassword: 'hackerPassword123' }),
    });
    assert.equal(res.status, 403);
  });

  test('TC-RBAC-05: Unauthenticated access to CEO approvals is blocked (401 Unauthorized)', async () => {
    const res = await fetch(`${BASE_URL}/api/ceo/approvals/appr-1/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' }),
    });
    assert.equal(res.status, 401);
  });
});

describe('Suite 3: Dashboard Telemetry, Analytics & Data Persistence', () => {
  test('TC-DATA-01: POST & GET /api/leads records and retrieves CRM leads', async () => {
    const testName = `Lead Telemetry ${Date.now()}`;
    const postRes = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testName,
        email: 'telemetry@business.com',
        phone: '+13055550199',
        src: 'Meta Ads',
        stage: 'New',
        val: 1800,
        need: 'Consulting Growth Funnel',
      }),
    });
    assert.equal(postRes.status, 201);
    const postData = await postRes.json();
    assert.equal(postData.lead.name, testName);

    const getRes = await fetch(`${BASE_URL}/api/leads`);
    assert.equal(getRes.status, 200);
    const getData = await getRes.json();
    assert.ok(getData.leads.some((l: any) => l.name === testName));
  });

  test('TC-DATA-02: POST & GET /api/bookings records and retrieves client calendar bookings', async () => {
    const bookingName = `Booking Client ${Date.now()}`;
    const postRes = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: bookingName,
        email: 'client@clinic.com',
        phone: '+971501234567',
        date: '2026-11-05',
        time: '14:00',
        service: 'Clinic Patient Booking Engine',
        durationMinutes: 45,
        st: 'Confirmed',
      }),
    });
    assert.equal(postRes.status, 201);

    const getRes = await fetch(`${BASE_URL}/api/bookings`);
    assert.equal(getRes.status, 200);
    const getData = await getRes.json();
    assert.ok(getData.bookings.some((b: any) => b.name === bookingName));
  });

  test('TC-DATA-03: POST & GET /api/whatsapp records and retrieves communication thread logs', async () => {
    const msgText = `WhatsApp Test Message ${Date.now()}`;
    const postRes = await fetch(`${BASE_URL}/api/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: 'Dr. Tariq',
        phone: '+923001234567',
        direction: 'inbound',
        text: msgText,
        status: 'delivered',
      }),
    });
    assert.equal(postRes.status, 201);

    const getRes = await fetch(`${BASE_URL}/api/whatsapp`);
    assert.equal(getRes.status, 200);
    const getData = await getRes.json();
    assert.ok(getData.messages.some((m: any) => m.text === msgText));
  });

  test('TC-DATA-04: POST & GET /api/projects records active client sprint deliverables', async () => {
    const projName = `Deliverable Project ${Date.now()}`;
    const postRes = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: projName,
        serviceType: 'Omni-Channel Funnel & AI Receptionist',
        status: 'In Progress',
        progress: 65,
        dealValue: 3500,
        milestones: [],
      }),
    });
    assert.equal(postRes.status, 201);

    const getRes = await fetch(`${BASE_URL}/api/projects`);
    assert.equal(getRes.status, 200);
    const getData = await getRes.json();
    assert.ok(getData.projects.some((p: any) => p.clientName === projName));
  });
});

describe('Suite 4: AI Agent Workflows & Fallback Error Handling', () => {
  test('TC-AI-01: POST /api/chat responds intelligently and auto-extracts visitor contact info', async () => {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, my name is David and my email is david@techfirm.io. What are your pricing plans?',
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.reply);
    assert.ok(data.leadCaptured);
    assert.equal(data.leadCaptured.email, 'david@techfirm.io');
  });

  test('TC-AI-02: POST /api/whatsapp-agent provides trilingual responses in Arabic', async () => {
    const res = await fetch(`${BASE_URL}/api/whatsapp-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'السلام عليكم، كم سعر نظام حجز العيادات؟',
        language: 'ar',
        clientName: 'أحمد النعيمي',
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.reply);
    assert.ok(data.qualification);
    assert.ok(typeof data.qualification.qualificationScore === 'number');
  });

  test('TC-AI-03: POST /api/whatsapp-agent provides trilingual responses in Urdu', async () => {
    const res = await fetch(`${BASE_URL}/api/whatsapp-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Salam, mujhe e-commerce store ke liye sales funnel aur AI chatbot chahiye.',
        language: 'ur',
        clientName: 'عمران خان',
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.reply);
    assert.ok(data.qualification);
  });
});

describe('Suite 5: Third-Party Webhooks & API Ingestion', () => {
  test('TC-WH-01: GET /api/webhook/whatsapp responds to Meta hub.mode verification handshake', async () => {
    const challenge = 'meta_test_challenge_998811';
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'bfb_whatsapp_secret';
    const res = await fetch(
      `${BASE_URL}/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=${challenge}`
    );
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.equal(text, challenge);
  });

  test('TC-WH-02: GET /api/webhook/whatsapp rejects incorrect verification token with 403', async () => {
    const res = await fetch(
      `${BASE_URL}/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=test`
    );
    assert.equal(res.status, 403);
  });

  test('TC-WH-03: POST /api/webhook/systeme successfully parses dynamic funnel contact payloads', async () => {
    const res = await fetch(`${BASE_URL}/api/webhook/systeme?channel=Affiliate%20Partner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact: {
          first_name: 'Farhan',
          last_name: 'Siddiqui',
          email: 'farhan@systeme-lead.com',
          phone: '+971520000000',
        },
        event: 'form_submitted',
        funnel_name: 'High-Ticket Agency Funnel',
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.lead.name, 'Farhan Siddiqui');
    assert.equal(data.lead.src, 'Affiliate Partner');
  });

  test('TC-WH-04: POST /api/webhook/stripe accepts completed checkout events', async () => {
    const res = await fetch(`${BASE_URL}/api/webhook/stripe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_mock_session_123',
            customer_details: {
              name: 'Dr. Faisal Healthcare',
              email: 'faisal@clinicgroup.ae',
            },
            amount_total: 150000,
            currency: 'usd',
          },
        },
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.received, true);
  });

  test('TC-WH-05: POST /api/webhook/paypal accepts payment capture completed event', async () => {
    const res = await fetch(`${BASE_URL}/api/webhook/paypal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'PAYMENT.CAPTURE.COMPLETED',
        resource: {
          id: 'PAYPAL-TX-123456789',
          payer: {
            email_address: 'payer@international-client.com',
            name: { given_name: 'Rashid', surname: 'Al-Kuwari' },
          },
          amount: { value: '1800.00', currency_code: 'USD' },
        },
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.received, true);
  });
});

describe('Suite 6: Global Payment Gateways, Proofs & Settlement Workflow', () => {
  let createdProofId = '';

  test('TC-PAY-01: GET /api/payments/config provides multi-currency bank accounts', async () => {
    const res = await fetch(`${BASE_URL}/api/payments/config`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.stripe.retainerPaymentUrl);
    assert.ok(data.gccBanks.some((b: any) => b.country === 'UAE' && b.bankName.includes('Emirates NBD')));
    assert.ok(data.pakistaniBanks.some((b: any) => b.serviceType.includes('Raast')));
    assert.ok(data.crypto.usdtTrc20Address);
  });

  test('TC-PAY-02: POST /api/payments/submit-proof queues bank slip and auto-updates CRM lead', async () => {
    const clientEmail = `deposit.${Date.now()}@apexuae.com`;
    const res = await fetch(`${BASE_URL}/api/payments/submit-proof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: 'Apex UAE Retainer',
        clientEmail,
        clientPhone: '+971500000001',
        amount: 1500,
        currency: 'USD',
        paymentMethod: 'gcc_bank',
        paymentMethodLabel: 'Emirates NBD UAE IBAN',
        transactionReference: `ENBD-REF-${Date.now()}`,
        receiptNote: 'Growth Plan 50% retainer transfer',
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.proof.status, 'pending_verification');
    createdProofId = data.proof.id;
  });

  test('TC-PAY-03: POST /api/payments/verify approves slip and advances CRM lead to Won', async () => {
    assert.ok(createdProofId);
    const res = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ceoToken}`,
      },
      body: JSON.stringify({
        id: createdProofId,
        status: 'verified',
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.proof.status, 'verified');
  });
});

describe('Suite 7: Ads Center Campaigns & CEO Approvals Integration', () => {
  let testCampaignId = '';

  test('TC-ADS-01: GET /api/campaigns lists all existing ad campaigns', async () => {
    const res = await fetch(`${BASE_URL}/api/campaigns`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.campaigns));
  });

  test('TC-ADS-02: POST /api/campaigns adds new draft campaign', async () => {
    const res = await fetch(`${BASE_URL}/api/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'meta',
        campaignName: 'Test Q4 Omnichannel Funnel Campaign',
        objective: 'leads',
        budgetDaily: 75,
        targetAudience: 'Agency Directors ($1M+ ARR)',
        geoTargets: ['United States', 'UAE'],
        adCopy: {
          headline: 'High-Converting Sales Funnels & 24/7 AI WhatsApp Closer',
          primaryText: 'Turn clicks into booked clients on autopilot.',
          ctaText: 'Claim Free Strategy Blueprint',
          format: 'single_image',
        },
        targetFunnelSlug: 'consulting-growth',
        status: 'draft',
      }),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    testCampaignId = data.campaign.id;
  });

  test('TC-ADS-03: POST /api/campaigns/:id/launch activates campaign with Bearer session', async () => {
    assert.ok(testCampaignId);
    const res = await fetch(`${BASE_URL}/api/campaigns/${testCampaignId}/launch`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ceoToken}` },
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.campaign.status, 'active');
  });

  test('TC-ADS-04: GET & POST /api/ceo/approvals queues budget approval item', async () => {
    const res = await fetch(`${BASE_URL}/api/ceo/approvals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ceoToken}`,
      },
      body: JSON.stringify({
        type: 'ad_campaign_launch',
        title: 'Approve $150/day Meta Ads Scaling Budget',
        entityName: 'Meta Ads: E-commerce Scaling',
        amount: 4500,
        currency: 'USD',
        urgency: 'high',
        requestedBy: 'Tariq Mansoor',
      }),
    });
    assert.equal(res.status, 201);
  });
});

describe('Suite 8: SEO, GEO, AEO & Responsive Directives', () => {
  test('TC-SEO-01: GET /robots.txt disallows machine dashboard and API routes', async () => {
    const res = await fetch(`${BASE_URL}/robots.txt`);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes('Disallow: /*view=machine'));
    assert.ok(text.includes('Disallow: /api/'));
    assert.ok(text.includes('Sitemap: https://backforbrand.com/sitemap.xml'));
  });

  test('TC-SEO-02: GET /sitemap.xml does NOT leak internal machine view', async () => {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes('<urlset'));
    assert.ok(text.includes('https://backforbrand.com/'));
    assert.equal(text.includes('?view=machine'), false, 'Private view leaked into sitemap');
  });

  test('TC-SEO-03: index.html contains responsive viewport meta tag and GEO tags', () => {
    const indexPath = path.resolve(process.cwd(), 'index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    assert.ok(html.includes('viewport-fit=cover'), 'index.html missing viewport-fit=cover');
    assert.ok(html.includes('geo.region'), 'index.html missing geo.region tag');
    assert.ok(html.includes('Miami, Florida'), 'index.html missing geo.placename tag');
    assert.ok(html.includes('@type": "FAQPage'), 'index.html missing FAQPage structured data');
  });
});

describe('Suite 9: Unit Testing: 0-100 Lead Hotness Scoring Algorithm', () => {
  test('TC-SCORE-01: High-intent booked lead scores in Hot or Very Hot tier', () => {
    const hotLead: Lead = {
      id: 'hot-lead-1',
      name: 'Executive Medical Director',
      email: 'director@premierhealth.org',
      phone: '923331112223',
      stage: 'Booked',
      val: 2500,
      src: 'SEO',
      createdAt: new Date().toISOString(),
      funnelStep: 'Discovery Call Booked',
    };

    const score = calculateLeadScore(hotLead, {
      bookings: [
        {
          id: 'bk-hot',
          name: 'Executive Medical Director',
          date: '2026-10-31',
          time: '11:00',
          st: 'Confirmed',
        },
      ],
      whatsappMessages: [
        {
          id: 'wa-1',
          clientName: 'Executive Medical Director',
          phone: '923331112223',
          direction: 'inbound',
          text: 'We are ready to proceed with the $2,500 clinic funnel setup.',
          status: 'read',
          timestamp: 'Just now',
        },
      ],
    });

    assert.ok(score.totalScore >= 60, `Expected score >= 60, got ${score.totalScore}`);
    assert.ok(['Very Hot', 'Hot'].includes(score.tier));
    assert.ok(score.factors.length > 0);
  });

  test('TC-SCORE-02: Stale lead with no interactions scores in Cold tier', () => {
    const coldLead: Lead = {
      id: 'cold-lead-1',
      name: 'Unqualified Bouncer',
      stage: 'New',
      val: 0,
      src: 'Direct/Other',
      createdAt: new Date(Date.now() - 3600000 * 24 * 45).toISOString(), // 45 days ago
    };

    const score = calculateLeadScore(coldLead, {});
    assert.ok(score.totalScore < 30, `Expected score < 30, got ${score.totalScore}`);
    assert.equal(score.tier, 'Cold');
  });
});
