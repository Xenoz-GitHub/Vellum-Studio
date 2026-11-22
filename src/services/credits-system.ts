import { db } from '../db/index';
import { users, userActivities } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Credits System for Algorithmic Generation
 * Manages user credits and tracks usage
 */

export interface CreditTransaction {
  userUid: string;
  creditsUsed: number;
  tokensUsed: number;
  action: string;
  metadata?: Record<string, unknown>;
}

export interface UserCredits {
  available: number;
  total: number;
  used: number;
}

// Credit earning rates
export const CREDIT_RATES = {
  SIGN_UP_BONUS: 100,
  CREATE_PRESENTATION: 5,
  COMPLETE_PROFILE: 20,
  DAILY_LOGIN: 10,
  FREE_DAILY_12H: 50, // NEW: 50 free credits every 12 hours
  SHARE_PRESENTATION: 3,
  EXPORT_PPTX: 2,
  REFERRAL_BONUS: 50,
  PREMIUM_MONTHLY: 1000,
};

// Credit costs
export const CREDIT_COSTS = {
  GENERATE_PRESENTATION_BASE: 10,
  PER_SLIDE: 2,
  ADVANCED_LAYOUT: 5,
  CUSTOM_THEME: 3,
  HD_EXPORT: 5,
};

// Payment plans for startup revenue
export const PAYMENT_PLANS = {
  STARTER: {
    credits: 500,
    price_php: 99, // GCash
    price_usd: 1.99, // PayPal
    popular: false,
  },
  PRO: {
    credits: 1500,
    price_php: 249, // GCash
    price_usd: 4.99, // PayPal
    popular: true,
  },
  BUSINESS: {
    credits: 5000,
    price_php: 699, // GCash
    price_usd: 13.99, // PayPal
    popular: false,
  },
  ENTERPRISE: {
    credits: 20000,
    price_php: 2499, // GCash
    price_usd: 49.99, // PayPal
    popular: false,
  },
};

// Get user's current credit balance
export async function getUserCredits(userUid: string): Promise<UserCredits> {
  const userRows = await db.select().from(users).where(eq(users.uid, userUid)).limit(1);
  
  if (!userRows[0]) {
    throw new Error('User not found');
  }
  
  const user = userRows[0];
  const preferences = user.preferences as any || {};
  const credits = preferences.credits || { available: 100, total: 100, used: 0 };
  
  return credits;
}

// Add credits to user account
export async function addCredits(
  userUid: string,
  amount: number,
  reason: string,
  metadata?: Record<string, unknown>
): Promise<UserCredits> {
  const userRows = await db.select().from(users).where(eq(users.uid, userUid)).limit(1);
  
  if (!userRows[0]) {
    throw new Error('User not found');
  }
  
  const user = userRows[0];
  const preferences = (user.preferences as any) || {};
  const credits = preferences.credits || { available: 100, total: 100, used: 0 };
  
  credits.available += amount;
  credits.total += amount;
  
  await db
    .update(users)
    .set({
      preferences: { ...preferences, credits },
      updatedAt: new Date(),
    })
    .where(eq(users.uid, userUid));
  
  // Log activity
  await db.insert(userActivities).values({
    userUid,
    action: `earn_credits_${reason}`,
    xpEarned: Math.ceil(amount / 2),
    meta: { credits: amount, reason, ...metadata },
  });
  
  return credits;
}

// Deduct credits from user account
export async function deductCredits(transaction: CreditTransaction): Promise<UserCredits> {
  const userRows = await db.select().from(users).where(eq(users.uid, transaction.userUid)).limit(1);
  
  if (!userRows[0]) {
    throw new Error('User not found');
  }
  
  const user = userRows[0];
  const preferences = (user.preferences as any) || {};
  const credits = preferences.credits || { available: 100, total: 100, used: 0 };
  
  if (credits.available < transaction.creditsUsed) {
    throw new Error(`Insufficient credits. Available: ${credits.available}, Required: ${transaction.creditsUsed}`);
  }
  
  credits.available -= transaction.creditsUsed;
  credits.used += transaction.creditsUsed;
  
  await db
    .update(users)
    .set({
      preferences: { ...preferences, credits },
      updatedAt: new Date(),
    })
    .where(eq(users.uid, transaction.userUid));
  
  // Log activity
  await db.insert(userActivities).values({
    userUid: transaction.userUid,
    action: `use_credits_${transaction.action}`,
    xpEarned: 0,
    meta: {
      creditsUsed: transaction.creditsUsed,
      tokensUsed: transaction.tokensUsed,
      action: transaction.action,
      ...transaction.metadata,
    },
  });
  
  return credits;
}

// Initialize credits for new user
export async function initializeUserCredits(userUid: string): Promise<void> {
  await addCredits(userUid, CREDIT_RATES.SIGN_UP_BONUS, 'signup', {
    initialBonus: true,
  });
}

// Daily login bonus
export async function claimDailyLoginBonus(userUid: string, clientDate?: string): Promise<UserCredits | null> {
  const userRows = await db.select().from(users).where(eq(users.uid, userUid)).limit(1);
  
  if (!userRows[0]) {
    throw new Error('User not found');
  }
  
  const user = userRows[0];
  const preferences = (user.preferences as any) || {};
  const lastClaim = preferences.lastDailyCredits;
  const today = clientDate?.split('T')[0] || new Date().toISOString().split('T')[0];
  
  if (lastClaim === today) {
    return null; // Already claimed today
  }
  
  preferences.lastDailyCredits = today;
  
  await db
    .update(users)
    .set({
      preferences,
      updatedAt: new Date(),
    })
    .where(eq(users.uid, userUid));
  
  return addCredits(userUid, CREDIT_RATES.DAILY_LOGIN, 'daily_login', { date: today });
}

// NEW: Free credits every 12 hours
export async function claimFreeCredits12H(userUid: string): Promise<UserCredits | null> {
  const userRows = await db.select().from(users).where(eq(users.uid, userUid)).limit(1);
  
  if (!userRows[0]) {
    throw new Error('User not found');
  }
  
  const user = userRows[0];
  const preferences = (user.preferences as any) || {};
  const lastFreeCredits = preferences.lastFreeCredits12H;
  const now = new Date();
  
  // Check if 12 hours have passed
  if (lastFreeCredits) {
    const lastClaimTime = new Date(lastFreeCredits);
    const hoursSinceLastClaim = (now.getTime() - lastClaimTime.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastClaim < 12) {
      const hoursRemaining = Math.ceil(12 - hoursSinceLastClaim);
      return null; // Not yet eligible
    }
  }
  
  preferences.lastFreeCredits12H = now.toISOString();
  
  await db
    .update(users)
    .set({
      preferences,
      updatedAt: new Date(),
    })
    .where(eq(users.uid, userUid));
  
  return addCredits(userUid, CREDIT_RATES.FREE_DAILY_12H, 'free_12h_credits', { 
    claimedAt: now.toISOString() 
  });
}

export const CreditsSystem = {
  getUserCredits,
  addCredits,
  deductCredits,
  initializeUserCredits,
  claimDailyLoginBonus,
  claimFreeCredits12H,
  CREDIT_RATES,
  CREDIT_COSTS,
  PAYMENT_PLANS,
};
