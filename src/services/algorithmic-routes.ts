/**
 * Algorithmic Generation Routes
 * Replaces AI API routes with pattern-based generation
 */
import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { AlgorithmicGenerator } from './algorithmic-generator';
import { CreditsSystem } from './credits-system';
import { createPresentationRecord } from '../db/repository';
import crypto from 'node:crypto';

export async function handleAlgorithmicGeneration(req: AuthRequest, res: Response) {
  const start = Date.now();
  const {
    prompt,
    slideCount = 6,
    category = 'Business',
    themeId = 'gallery-alabaster',
    aspectRatio = '16:9',
  } = req.body || {};

  if (!prompt || String(prompt).trim().length < 3) {
    return res.status(400).json({ error: 'Please provide a presentation prompt or topic.' });
  }

  try {
    // Calculate tokens and check credits
    const tokenUsage = AlgorithmicGenerator.calculateTokens({
      prompt: String(prompt),
      slideCount: Number(slideCount),
      category: String(category),
      themeId: String(themeId),
      aspectRatio: String(aspectRatio),
    });

    const userCredits = await CreditsSystem.getUserCredits(req.authUser!.uid);
    
    if (userCredits.available < tokenUsage.creditsDeducted) {
      return res.status(402).json({
        error: `Insufficient credits. Required: ${tokenUsage.creditsDeducted}, Available: ${userCredits.available}`,
        tokensRequired: tokenUsage.tokensUsed,
        creditsRequired: tokenUsage.creditsDeducted,
        creditsAvailable: userCredits.available,
      });
    }

    // Generate presentation algorithmically
    const document = AlgorithmicGenerator.generatePresentation({
      prompt: String(prompt),
      slideCount: Math.min(20, Math.max(1, Number(slideCount))),
      category: String(category),
      themeId: String(themeId),
      aspectRatio: String(aspectRatio),
    });

    // Create presentation record
    const created = await createPresentationRecord({
      ownerUid: req.authUser!.uid,
      title: document.title,
      description: document.description,
      category: document.category,
      themeId: document.themeId,
      thumbnailUrl: '',
      sourceType: 'algorithmic',
      document,
    });

    // Deduct credits
    const newBalance = await CreditsSystem.deductCredits({
      userUid: req.authUser!.uid,
      creditsUsed: tokenUsage.creditsDeducted,
      tokensUsed: tokenUsage.tokensUsed,
      action: 'generate_presentation',
      metadata: {
        presentationId: created.id,
        slideCount: document.slides.length,
        category: document.category,
        durationMs: Date.now() - start,
      },
    });

    res.status(201).json({
      presentation: created,
      tokenUsage,
      creditsRemaining: newBalance.available,
      durationMs: Date.now() - start,
    });
  } catch (error: any) {
    console.error('Algorithmic generation error:', error);
    res.status(500).json({
      error: error.message || 'Generation failed.',
    });
  }
}

export async function handleCreditsInfo(req: AuthRequest, res: Response) {
  try {
    const credits = await CreditsSystem.getUserCredits(req.authUser!.uid);
    res.json({
      credits,
      rates: CreditsSystem.CREDIT_RATES,
      costs: CreditsSystem.CREDIT_COSTS,
    });
  } catch (error: any) {
    console.error('Credits info error:', error);
    res.status(500).json({ error: 'Failed to fetch credits info.' });
  }
}

export async function handleClaimDailyBonus(req: AuthRequest, res: Response) {
  try {
    const result = await CreditsSystem.claimDailyLoginBonus(
      req.authUser!.uid,
      req.headers['x-client-date'] as string
    );
    
    if (!result) {
      return res.json({ claimed: false, message: 'Already claimed today' });
    }
    
    res.json({
      claimed: true,
      creditsEarned: CreditsSystem.CREDIT_RATES.DAILY_LOGIN,
      newBalance: result,
    });
  } catch (error: any) {
    console.error('Daily bonus error:', error);
    res.status(500).json({ error: 'Failed to claim daily bonus.' });
  }
}
