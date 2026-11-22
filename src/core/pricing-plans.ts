export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  credits: number;
  pricePhp: number;
  priceUsd: number;
  popular?: boolean;
  accent: 'lime' | 'cyan' | 'fuchsia' | 'amber';
  features: string[];
}

export const FREE_PLAN = {
  id: 'free',
  name: 'Free Forever',
  tagline: 'Everything you need to ship your first great deck.',
  credits: 100,
  features: [
    '100 starter credits on signup',
    '+50 free credits every 12 hours',
    'Full editor + slide renderer',
    'PowerPoint (.pptx) & PDF export',
    'All Y2K component packs',
    'Community templates',
  ],
} as const;

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For the occasional deck and the side hustle.',
    credits: 500,
    pricePhp: 99,
    priceUsd: 1.99,
    accent: 'cyan',
    features: [
      '500 credits',
      'All Free plan features',
      'Priority generation queue',
      'Custom color token sets',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For people who present every single week.',
    credits: 1500,
    pricePhp: 249,
    priceUsd: 4.99,
    popular: true,
    accent: 'fuchsia',
    features: [
      '1,500 credits',
      'Everything in Starter',
      'Advanced layout + chart generation',
      'HD export and brand fonts',
      'Share links with analytics',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For teams shipping decks together.',
    credits: 5000,
    pricePhp: 699,
    priceUsd: 13.99,
    accent: 'lime',
    features: [
      '5,000 credits',
      'Everything in Pro',
      'Team workspaces and shared libraries',
      'Custom component manifests',
      'Admin console and audit logs',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For design systems with a deck problem.',
    credits: 20000,
    pricePhp: 2499,
    priceUsd: 49.99,
    accent: 'amber',
    features: [
      '20,000 credits',
      'Everything in Business',
      'SSO and role-based access',
      'Licensed font asset hosting',
      'Dedicated onboarding',
    ],
  },
];

export const CREDIT_MATH = {
  base: 10,
  perSlide: 2,
  freeEvery12h: 50,
  signupBonus: 100,
};
