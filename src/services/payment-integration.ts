/**
 * Payment Integration for GCash and PayPal
 * Handles credit purchases and payment processing
 */

import { CreditsSystem, PAYMENT_PLANS } from './credits-system';
import crypto from 'node:crypto';

export interface PaymentRequest {
  userUid: string;
  plan: 'STARTER' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
  method: 'gcash' | 'paypal';
  email: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  creditsAdded: number;
  paymentUrl?: string;
  qrCode?: string;
  message: string;
}

// GCash Payment Integration
export async function createGCashPayment(request: PaymentRequest): Promise<PaymentResponse> {
  const plan = PAYMENT_PLANS[request.plan];
  
  if (!plan) {
    throw new Error('Invalid payment plan');
  }
  
  // In production, integrate with GCash API
  // For now, return mock response with payment URL
  const transactionId = `gcash-${crypto.randomUUID().slice(0, 12)}`;
  
  // Mock GCash payment flow
  const paymentUrl = `https://payment.gcash.com/checkout?amount=${plan.price_php}&ref=${transactionId}&merchant=vellum-studio`;
  const qrCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`; // Mock QR code
  
  return {
    success: true,
    transactionId,
    creditsAdded: 0, // Will be added after payment confirmation
    paymentUrl,
    qrCode,
    message: `GCash payment initiated. Amount: ₱${plan.price_php}. Complete payment to receive ${plan.credits} credits.`,
  };
}

// PayPal Payment Integration
export async function createPayPalPayment(request: PaymentRequest): Promise<PaymentResponse> {
  const plan = PAYMENT_PLANS[request.plan];
  
  if (!plan) {
    throw new Error('Invalid payment plan');
  }
  
  // In production, integrate with PayPal SDK
  // For now, return mock response with payment URL
  const transactionId = `paypal-${crypto.randomUUID().slice(0, 12)}`;
  
  // Mock PayPal payment flow
  const paymentUrl = `https://www.paypal.com/checkoutnow?token=${transactionId}&amount=${plan.price_usd}`;
  
  return {
    success: true,
    transactionId,
    creditsAdded: 0, // Will be added after payment confirmation
    paymentUrl,
    message: `PayPal payment initiated. Amount: $${plan.price_usd}. Complete payment to receive ${plan.credits} credits.`,
  };
}

// Webhook handler for payment confirmation
export async function handlePaymentWebhook(
  method: 'gcash' | 'paypal',
  transactionId: string,
  status: 'completed' | 'failed',
  userUid: string,
  plan: 'STARTER' | 'PRO' | 'BUSINESS' | 'ENTERPRISE'
): Promise<{ success: boolean; creditsAdded: number }> {
  
  if (status !== 'completed') {
    return { success: false, creditsAdded: 0 };
  }
  
  const planDetails = PAYMENT_PLANS[plan];
  
  if (!planDetails) {
    throw new Error('Invalid payment plan');
  }
  
  // Add credits to user account
  const newBalance = await CreditsSystem.addCredits(
    userUid,
    planDetails.credits,
    'purchase',
    {
      transactionId,
      paymentMethod: method,
      plan,
      amount: method === 'gcash' ? planDetails.price_php : planDetails.price_usd,
      currency: method === 'gcash' ? 'PHP' : 'USD',
    }
  );
  
  return {
    success: true,
    creditsAdded: planDetails.credits,
  };
}

// Get payment plans
export function getPaymentPlans() {
  return Object.entries(PAYMENT_PLANS).map(([key, plan]) => ({
    id: key,
    name: key.charAt(0) + key.slice(1).toLowerCase(),
    credits: plan.credits,
    pricePhp: plan.price_php,
    priceUsd: plan.price_usd,
    popular: plan.popular,
    features: getPlanFeatures(key as any),
  }));
}

function getPlanFeatures(plan: keyof typeof PAYMENT_PLANS): string[] {
  const features = {
    STARTER: [
      '500 credits',
      '~12 presentations',
      'Basic templates',
      'Standard export',
      'Email support',
    ],
    PRO: [
      '1,500 credits',
      '~37 presentations',
      'Premium templates',
      'HD export',
      'Priority support',
      'Custom branding',
    ],
    BUSINESS: [
      '5,000 credits',
      '~125 presentations',
      'All templates',
      '4K export',
      '24/7 support',
      'Team collaboration',
      'Analytics dashboard',
    ],
    ENTERPRISE: [
      '20,000 credits',
      '~500 presentations',
      'Unlimited templates',
      'Custom development',
      'Dedicated support',
      'White-label option',
      'API access',
      'Priority processing',
    ],
  };
  
  return features[plan];
}

// Production integration notes:
/**
 * GCash Integration:
 * 1. Sign up for GCash Business account
 * 2. Get API credentials from https://developer.gcash.com
 * 3. Install GCash SDK: npm install @paymongo/gcash
 * 4. Implement proper webhook verification
 * 5. Handle payment status updates
 * 
 * PayPal Integration:
 * 1. Sign up for PayPal Business account
 * 2. Get API credentials from https://developer.paypal.com
 * 3. Install PayPal SDK: npm install @paypal/checkout-server-sdk
 * 4. Implement proper webhook verification
 * 5. Handle payment status updates
 * 
 * Security:
 * - Use HTTPS for all payment requests
 * - Verify webhook signatures
 * - Store transaction logs
 * - Implement rate limiting
 * - Add fraud detection
 * - Comply with PCI DSS if handling card data
 */

export const PaymentIntegration = {
  createGCashPayment,
  createPayPalPayment,
  handlePaymentWebhook,
  getPaymentPlans,
};
