import {
  Send,
  Zap,
  UserPlus,
  History,
  Users,
  Landmark,
  Repeat,
  Briefcase,
  Calculator,
} from 'lucide-react';

// Single source of truth for the feature cards shown on the Dashboard
// and on the Pay & Transfer / Deposits hub pages. `tone` picks the subtle
// icon background defined in FeatureCard.css.

export const PAY_TRANSFER_FEATURES = [
  {
    title: 'Send Money',
    description: 'Transfer money to a bank account or saved beneficiary.',
    icon: Send,
    to: '/pay-transfer/send',
    cta: 'Send Money',
    tone: 'blue',
  },
  {
    title: 'Quick Pay',
    description: 'Make a quick payment to a saved payee.',
    icon: Zap,
    to: '/pay-transfer/quick-pay',
    cta: 'Pay Now',
    tone: 'amber',
  },
  {
    title: 'Add Beneficiary',
    description: 'Add a new beneficiary with account details.',
    icon: UserPlus,
    to: '/beneficiaries/add',
    cta: 'Add Beneficiary',
    tone: 'green',
  },
  {
    title: 'Transfer History',
    description: 'View your previous transfer requests.',
    icon: History,
    to: '/transfer-history',
    cta: 'View History',
    tone: 'violet',
  },
  {
    title: 'Manage Payees',
    description: 'View and manage your saved recipients.',
    icon: Users,
    to: '/beneficiaries',
    cta: 'Manage Payees',
    tone: 'rose',
  },
];

export const DEPOSIT_FEATURES = [
  {
    title: 'Fixed Deposit (FD)',
    description: 'Explore fixed deposit plans and create a deposit.',
    icon: Landmark,
    to: '/deposits/fd',
    cta: 'Explore FD',
    tone: 'blue',
  },
  {
    title: 'Recurring Deposit (RD)',
    description: 'Explore recurring deposit plans and start saving monthly.',
    icon: Repeat,
    to: '/deposits/rd',
    cta: 'Start RD',
    tone: 'green',
  },
  {
    title: 'My Deposits',
    description: 'View your existing deposits and their details.',
    icon: Briefcase,
    to: '/deposits/my',
    cta: 'View Deposits',
    tone: 'violet',
  },
  {
    title: 'Deposit Calculator',
    description: 'Estimate maturity amounts and interest (demo rates).',
    icon: Calculator,
    to: '/deposits/calculator',
    cta: 'Calculate Returns',
    tone: 'amber',
  },
];
