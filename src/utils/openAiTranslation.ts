import { TranslationMode } from './translationModes';

export type TranslationVariant = {
  formal: string;
  casual: string;
  formalTts?: string;
  casualTts?: string;
};

export type OpenAiTranslationResult = {
  source: string;
  translationEn?: TranslationVariant;
  translationHe?: TranslationVariant;
  translationRu?: TranslationVariant;
};

type TranslateWithOpenAiParams = {
  text: string;
  mode: TranslationMode;
  apiKey: string;
  model: string;
};

type ResponsesApiTextItem = {
  type?: string;
  text?: string;
};

type ResponsesApiOutputItem = {
  content?: ResponsesApiTextItem[];
};

type ResponsesApiResponse = {
  output?: ResponsesApiOutputItem[];
};

type JsonSchema = {
  type: 'object';
  properties: Record<string, unknown>;
  required: string[];
  additionalProperties: boolean;
};

function buildInstructions(mode: TranslationMode): string {
  switch (mode) {
    case TranslationMode.RuToEn:
      return [
        'You are a translation engine for a private mobile app.',
        'The user provides a Russian phrase.',
        'Translate it into English.',
        'Return two distinct English variants of the same meaning.',
        'formal = standard, grammatically correct English, suitable for polite written communication, no slang.',
        'casual = natural spoken English, everyday conversational style, slang is allowed only if it sounds natural.',
        'The formal and casual English variants must be clearly different in wording and register.',
        'Do not return the same sentence twice.',
        'Preserve the original meaning and emotional tone as closely as possible.',
        'Do not add explanations.',
      ].join(' ');

    case TranslationMode.RuToHe:
      return [
        'You are a translation engine for a private mobile app.',
        'The user provides a Russian phrase.',
        'Translate it into Hebrew.',
        'Return two distinct Hebrew variants of the same meaning.',
        'formal = standard, grammatically correct Hebrew, suitable for polite written communication, no slang.',
        'casual = natural spoken Israeli Hebrew, everyday conversational style, slang is allowed only if it sounds natural.',
        'The formal and casual Hebrew variants must be clearly different in wording and register.',
        'Do not return the same sentence twice.',
        'Preserve the original meaning and emotional tone as closely as possible.',
        'Use natural modern Hebrew.',
        'For Hebrew, also provide formalTts and casualTts which are the same as formal and casual but WITH HEBREW VOWELS (nikkud) for better text-to-speech quality.',
        'Do not add explanations.',
      ].join(' ');

    case TranslationMode.EnToRu:
      return [
        'You are a translation engine for a private mobile app.',
        'The user provides an English phrase.',
        'Translate it into Russian.',
        'Return two distinct Russian variants of the same meaning.',
        'formal = standard, grammatically correct Russian, suitable for polite written communication, no slang.',
        'casual = natural spoken Russian, everyday conversational style, slang is allowed only if it sounds natural.',
        'The formal and casual Russian variants must be clearly different in wording and register.',
        'Do not return the same sentence twice.',
        'Preserve the original meaning and emotional tone as closely as possible.',
        'For Russian, also provide formalTts and casualTts which are the same as formal and casual but WITH STRESS MARKS (using the \u0301 combining acute accent) on the stressed vowels to improve text-to-speech quality.',
        'Do not add explanations.',
      ].join(' ');

    case TranslationMode.HeToRu:
      return [
        'You are a translation engine for a private mobile app.',
        'The user provides a Hebrew phrase.',
        'Translate it into Russian.',
        'Return two distinct Russian variants of the same meaning.',
        'formal = standard, grammatically correct Russian, suitable for polite written communication, no slang.',
        'casual = natural spoken Russian, everyday conversational style, slang is allowed only if it sounds natural.',
        'The formal and casual Russian variants must be clearly different in wording and register.',
        'Do not return the same sentence twice.',
        'Preserve the original meaning and emotional tone as closely as possible.',
        'For Russian, also provide formalTts and casualTts which are the same as formal and casual but WITH STRESS MARKS (using the \u0301 combining acute accent) on the stressed vowels to improve text-to-speech quality.',
        'Do not add explanations.',
      ].join(' ');

    case TranslationMode.RuToEnHe:
      return [
        'You are a translation engine for a private mobile app.',
        'The user provides a Russian phrase.',
        'Translate it into both English and Hebrew.',
        'For each language, return two distinct variants of the same meaning.',
        'formal = standard, grammatically correct language, suitable for polite written communication, no slang.',
        'casual = natural spoken language, everyday conversational style, slang is allowed only if it sounds natural.',
        'For each language separately, the formal and casual variants must be clearly different in wording and register.',
        'Do not return the same sentence twice within the same language.',
        'Preserve the original meaning and emotional tone as closely as possible.',
        'Use natural modern Hebrew for Hebrew outputs.',
        'For Hebrew, provide formalTts and casualTts WITH HEBREW VOWELS (nikkud).',
        'For Russian (if applicable), use STRESS MARKS in TTS fields.',
        'Do not add explanations.',
      ].join(' ');
  }
}

function createVariantSchema(descriptionPrefix: string, includeTts: boolean = false): JsonSchema {
  const properties: Record<string, unknown> = {
    formal: {
      type: 'string',
      description: `${descriptionPrefix} formal translation. Standard, grammatically correct, no slang.`,
    },
    casual: {
      type: 'string',
      description: `${descriptionPrefix} casual translation. Natural spoken style, clearly different from the formal variant.`,
    },
  };

  const required = ['formal', 'casual'];

  if (includeTts) {
    properties.formalTts = {
      type: 'string',
      description: `${descriptionPrefix} formal translation with vowels/stress marks for TTS.`,
    };
    properties.casualTts = {
      type: 'string',
      description: `${descriptionPrefix} casual translation with vowels/stress marks for TTS.`,
    };
    required.push('formalTts', 'casualTts');
  }

  return {
    type: 'object',
    properties,
    required,
    additionalProperties: false,
  };
}

function getSchemaForMode(mode: TranslationMode): JsonSchema {
  switch (mode) {
    case TranslationMode.RuToEn:
      return {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: 'Original Russian text exactly as provided by the user.',
          },
          translationEn: createVariantSchema('English'),
        },
        required: ['source', 'translationEn'],
        additionalProperties: false,
      };

    case TranslationMode.RuToHe:
      return {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: 'Original Russian text exactly as provided by the user.',
          },
          translationHe: createVariantSchema('Hebrew', true),
        },
        required: ['source', 'translationHe'],
        additionalProperties: false,
      };

    case TranslationMode.EnToRu:
      return {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: 'Original English text exactly as provided by the user.',
          },
          translationRu: createVariantSchema('Russian', true),
        },
        required: ['source', 'translationRu'],
        additionalProperties: false,
      };

    case TranslationMode.HeToRu:
      return {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: 'Original Hebrew text exactly as provided by the user.',
          },
          translationRu: createVariantSchema('Russian', true),
        },
        required: ['source', 'translationRu'],
        additionalProperties: false,
      };

    case TranslationMode.RuToEnHe:
      return {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: 'Original Russian text exactly as provided by the user.',
          },
          translationEn: createVariantSchema('English'),
          translationHe: createVariantSchema('Hebrew', true),
        },
        required: ['source', 'translationEn', 'translationHe'],
        additionalProperties: false,
      };
  }
}

function extractOutputText(responseData: ResponsesApiResponse): string {
  const outputItems = responseData.output ?? [];

  return outputItems
    .flatMap(item => item.content ?? [])
    .filter(contentItem => contentItem.type === 'output_text')
    .map(contentItem => contentItem.text ?? '')
    .join('')
    .trim();
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeVariant(value: unknown): TranslationVariant | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const variant = value as Partial<TranslationVariant>;
  const formal = normalizeString(variant.formal);
  const casual = normalizeString(variant.casual);
  const formalTts = normalizeString(variant.formalTts);
  const casualTts = normalizeString(variant.casualTts);

  if (!formal && !casual) {
    return undefined;
  }

  return {
    formal: formal || '',
    casual: casual || '',
    formalTts,
    casualTts,
  };
}

function parseTranslationResult(rawText: string, originalText: string): OpenAiTranslationResult {
  const parsed = JSON.parse(rawText) as Record<string, unknown>;

  return {
    source: normalizeString(parsed.source) || originalText,
    translationEn: normalizeVariant(parsed.translationEn),
    translationHe: normalizeVariant(parsed.translationHe),
    translationRu: normalizeVariant(parsed.translationRu),
  };
}

function validateResult(result: OpenAiTranslationResult, mode: TranslationMode): void {
  if (!result.source.trim()) {
    throw new Error('OpenAI response is missing "source"');
  }

  if (mode === TranslationMode.RuToEn && !result.translationEn) {
    throw new Error('OpenAI response is missing "translationEn"');
  }

  if (mode === TranslationMode.RuToHe && !result.translationHe) {
    throw new Error('OpenAI response is missing "translationHe"');
  }

  if (mode === TranslationMode.RuToEnHe && (!result.translationEn || !result.translationHe)) {
    throw new Error('OpenAI response is missing "translationEn" or "translationHe"');
  }

  if ((mode === TranslationMode.EnToRu || mode === TranslationMode.HeToRu) && !result.translationRu) {
    throw new Error('OpenAI response is missing "translationRu"');
  }
}

export async function translateWithOpenAi({ text, mode, apiKey, model }: TranslateWithOpenAiParams): Promise<OpenAiTranslationResult> {
  const trimmedText = text.trim();

  if (!trimmedText) {
    throw new Error('Text for translation is empty');
  }

  if (!apiKey.trim()) {
    throw new Error('OpenAI API key is empty');
  }

  const isGpt5Family = model.startsWith('gpt-5');

  const requestBody: Record<string, unknown> = {
    model,

    ...(isGpt5Family
      ? {
          reasoning: {
            effort: 'low',
          },
        }
      : {
          temperature: 0,
        }),

    input: [
      {
        role: 'developer',
        content: [
          {
            type: 'input_text',
            text: buildInstructions(mode),
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: trimmedText,
          },
        ],
      },
    ],

    text: {
      ...(isGpt5Family
        ? {
            verbosity: 'low',
          }
        : {}),

      format: {
        type: 'json_schema',
        name: 'translation_result',
        strict: true,
        schema: getSchemaForMode(mode),
      },
    },
  };

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`OpenAI request failed with status ${response.status}: ${errorText}`);
  }

  const responseData = (await response.json()) as ResponsesApiResponse;
  const rawText = extractOutputText(responseData);

  if (!rawText) {
    throw new Error('OpenAI request returned empty output');
  }

  let result: OpenAiTranslationResult;

  try {
    result = parseTranslationResult(rawText, trimmedText);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON parse error';

    throw new Error(`Failed to parse OpenAI JSON response: ${message}. Raw output: ${rawText}`);
  }

  validateResult(result, mode);

  return result;
}
