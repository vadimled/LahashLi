import { TranslationMode } from './translationModes';

export type TranslationVariant = {
  formal: string;
  casual: string;
};

export type OpenAiTranslationResult = {
  source: string;
  translationEn?: TranslationVariant;
  translationHe?: TranslationVariant;
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
    case 'ruToEn':
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

    case 'ruToHe':
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
        'Do not add explanations.',
      ].join(' ');

    case 'ruToEnHe':
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
        'Do not add explanations.',
      ].join(' ');
  }
}

function createVariantSchema(descriptionPrefix: string): JsonSchema {
  return {
    type: 'object',
    properties: {
      formal: {
        type: 'string',
        description: `${descriptionPrefix} formal translation. Standard, grammatically correct, no slang.`,
      },
      casual: {
        type: 'string',
        description: `${descriptionPrefix} casual translation. Natural spoken style, clearly different from the formal variant.`,
      },
    },
    required: ['formal', 'casual'],
    additionalProperties: false,
  };
}

function getSchemaForMode(mode: TranslationMode): JsonSchema {
  switch (mode) {
    case 'ruToEn':
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

    case 'ruToHe':
      return {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: 'Original Russian text exactly as provided by the user.',
          },
          translationHe: createVariantSchema('Hebrew'),
        },
        required: ['source', 'translationHe'],
        additionalProperties: false,
      };

    case 'ruToEnHe':
      return {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: 'Original Russian text exactly as provided by the user.',
          },
          translationEn: createVariantSchema('English'),
          translationHe: createVariantSchema('Hebrew'),
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

  if (!formal && !casual) {
    return undefined;
  }

  return {
    formal,
    casual,
  };
}

function parseTranslationResult(rawText: string, originalText: string): OpenAiTranslationResult {
  const parsed = JSON.parse(rawText) as Record<string, unknown>;

  return {
    source: normalizeString(parsed.source) || originalText,
    translationEn: normalizeVariant(parsed.translationEn),
    translationHe: normalizeVariant(parsed.translationHe),
  };
}

function validateResult(result: OpenAiTranslationResult, mode: TranslationMode): void {
  if (!result.source.trim()) {
    throw new Error('OpenAI response is missing "source"');
  }

  if (mode === 'ruToEn' && !result.translationEn) {
    throw new Error('OpenAI response is missing "translationEn"');
  }

  if (mode === 'ruToHe' && !result.translationHe) {
    throw new Error('OpenAI response is missing "translationHe"');
  }

  if (mode === 'ruToEnHe' && (!result.translationEn || !result.translationHe)) {
    throw new Error('OpenAI response is missing "translationEn" or "translationHe"');
  }
}

export async function translateWithOpenAi({
  text,
  mode,
  apiKey,
  model,
}: TranslateWithOpenAiParams): Promise<OpenAiTranslationResult> {
  const trimmedText = text.trim();

  if (!trimmedText) {
    throw new Error('Text for translation is empty');
  }

  if (!apiKey.trim()) {
    throw new Error('OpenAI API key is empty');
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0,
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
        format: {
          type: 'json_schema',
          name: 'translation_result',
          strict: true,
          schema: getSchemaForMode(mode),
        },
      },
    }),
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
