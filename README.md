# FINCENTRAL BANK — Digital Banking Management System

A Secure and Smart Platform for Modern Banking (frontend-only demo, college project).

## Setup

```bash
npm install
npm run dev
```

Demo login: **demo@fincentral.com** / **Demo@1234** (auto-seeded on first run,
re-auth method: password).

To try the new PIN-based re-authentication flow, sign up for a new account and
choose **Demo PIN** on the Sign Up page.

## Stack
React 18 + Vite, React Router v6, lucide-react icons. No backend — auth and data
are simulated with localStorage (see `src/utils/auth.js`).

## Progress against the redesign brief
- ✅ Phase 1–3: audited the project, fixed a real bug (the shared `Card`
  component had no styles at all — `components/Card.css` contained orphaned
  content from an unrelated page), unified hardcoded colors onto the design
  tokens across Cards/Statement/BillPayments, added `PageHeader`, `EmptyState`,
  `Skeleton`, and `PinInput` reusable components, removed unused legacy
  prototype files.
- ✅ Phase 4: Sign Up now lets the user choose their session re-authentication
  method — a 4-digit demo PIN or their account password — captured via the
  new `PinInput` component and stored per-user in `utils/auth.js`
  (`reauthMethod`, `pin`, and `verifyReauthCredential`).
- ⏳ Not yet built: Money Transfer, Beneficiary Management, QR Payments,
  Settings, full Transaction History pages (Phase 5), the session-timeout /
  "Verify Your Identity" lock screen that will actually call
  `verifyReauthCredential` (Phase 6), and a final responsiveness pass
  (Phase 7). The sidebar still marks these as "Soon" until then.
