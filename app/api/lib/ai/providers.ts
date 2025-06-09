// AI Model Providers Configuration
// Extracted from app/api/chat/route.ts

import { customProvider, wrapLanguageModel, extractReasoningMiddleware } from 'ai';
import { xai } from '@ai-sdk/xai';
import { groq } from '@ai-sdk/groq';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

// Middleware for reasoning extraction
const middleware = extractReasoningMiddleware({
  tagName: 'think',
});

// Custom provider with multiple AI models
export const neuman = customProvider({
  languageModels: {
    'neuman-default': openai('o4-mini-2025-04-16'),
    'neuman-grok-3': xai('grok-3-fast-beta'),
    'neuman-vision': xai('grok-2-vision-1212'),
    'neuman-4o': openai('gpt-4o', {
      structuredOutputs: true,
    }),
    'neuman-4.1-nano': openai('gpt-4.1-nano', {}),
    'neuman-o4-mini': openai.responses('o4-mini-2025-04-16'),
    'neuman-qwq': wrapLanguageModel({
      model: groq('qwen-qwq-32b'),
      middleware,
    }),
    'neuman-google': google('gemini-2.5-flash-preview-04-17', {
      structuredOutputs: true,
    }),
    'neuman-gemini': google('gemini-2.5-pro-exp-03-25', {
      structuredOutputs: true,
    }),
    'neuman-anthropic': anthropic('claude-3-7-sonnet-20250219'),
  },
});

/**
 * Get provider-specific options based on model
 */
export function getProviderOptions(model: string) {
  return {
    neuman: {
      ...(model === 'neuman-default'
        ? {
            reasoningEffort: 'high',
          }
        : {}),
      ...(model === 'neuman-o4-mini'
        ? {
            reasoningEffort: 'medium',
          }
        : {}),
      ...(model === 'neuman-google'
        ? {
            thinkingConfig: {
              thinkingBudget: 5000,
            },
          }
        : {}),
    },
    google: {
      thinkingConfig: {
        thinkingBudget: 5000,
      },
    },
    openai: {
      ...(model === 'neuman-o4-mini'
        ? {
            reasoningEffort: 'medium',
          }
        : {}),
    },
    xai: {
      ...(model === 'neuman-default'
        ? {
            reasoningEffort: 'high',
          }
        : {}),
    },
    anthropic: {
      thinking: { type: 'enabled', budgetTokens: 12000 },
    },
  };
}

/**
 * Get temperature setting based on model
 */
export function getTemperature(model: string): number | undefined {
  return model !== 'neuman-o4-mini' ? 0 : undefined;
}

/**
 * Get max steps for tool usage
 */
export function getMaxSteps(): number {
  return 5;
}

/**
 * Available model names
 */
export const AVAILABLE_MODELS = [
  'neuman-default',
  'neuman-grok-3',
  'neuman-vision',
  'neuman-4o',
  'neuman-4.1-nano',
  'neuman-o4-mini',
  'neuman-qwq',
  'neuman-google',
  'neuman-gemini',
  'neuman-anthropic',
] as const;

export type AvailableModel = (typeof AVAILABLE_MODELS)[number];

/**
 * Check if a model name is valid
 */
export function isValidModel(model: string): model is AvailableModel {
  return AVAILABLE_MODELS.includes(model as AvailableModel);
} 