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

function buildInstructions(mode: TranslationMode): string {
  switch (mode) {
    case 'ruToEn':
      return [
        'You are a translation engine for a private mobile app.',
        'The user speaks Russian.',
        'Return two English translations of the same phrase.',
        'formal = standard, grammatically correct English, suitable for polite written communication, no slang.',
        'casual = natural spoken English, everyday conversational style, slang is allowed if natural.',
        'The two English outputs must be clearly different in wording and register.',
        'Do not return the same sentence twice.',
        'Preserve the original meaning.',
        'Return only strict JSON.',
        'Schema: {"source":"string","translationEn":{"formal":"string","casual":"string"}}',
        'Do not add markdown.',
        'Do not add explanations.',
      ].join(' ');

    case 'ruToHe':
      return [
        'You are a translation engine for a private mobile app.',
        'The user speaks Russian.',
        'Return two Hebrew translations of the same phrase.',
        'formal = standard, grammatically correct Hebrew, suitable for polite written communication, no slang.',
        'casual = natural spoken Israeli Hebrew, everyday conversational style, slang is allowed if natural.',
        'The two Hebrew outputs must be clearly different in wording and register.',
        'Do not return the same sentence twice.',
        'Preserve the original meaning.',
        'Return only strict JSON.',
        'Schema: {"source":"string","translationHe":{"formal":"string","casual":"string"}}',
        'Do not add markdown.',
        'Do not add explanations.',
      ].join(' ');

    case 'ruToEnHe':
      return [
        'You are a translation engine for a private mobile app.',
        'The user speaks Russian.',
        'Return two English translations and two Hebrew translations of the same phrase.',
        'For each language:',
        'formal = standard, grammatically correct language, suitable for polite written communication, no slang.',
        'casual = natural spoken language, everyday conversational style, slang is allowed if natural.',
        'The two language outputs must be clearly different in wording and register.',
        'Do not return the same sentence twice.',
        'Preserve the original meaning.',
        'Return only strict JSON.',
        'Schema: {"source":"string","translationEn":{"formal":"string","casual":"string"},"translationHe":{"formal":"string","casual":"string"}}',
        'Do not add markdown.',
        'Do not add explanations.',
      ].join(' ');
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

function normalizeVariant(variant?: Partial<TranslationVariant>): TranslationVariant | undefined {
  const formal = variant?.formal?.trim();
  const casual = variant?.casual?.trim();

  if (!formal && !casual) {
    return undefined;
  }

  return {
    formal: formal ?? '',
    casual: casual ?? '',
  };
}

function parseTranslationResult(rawText: string, originalText: string): OpenAiTranslationResult {
  const parsed = JSON.parse(rawText) as OpenAiTranslationResult;

  return {
    source: parsed.source?.trim() || originalText,
    translationEn: normalizeVariant(parsed.translationEn),
    translationHe: normalizeVariant(parsed.translationHe),
  };
}

export async function translateWithOpenAi({
  text,
  mode,
  apiKey,
  model,
}: TranslateWithOpenAiParams): Promise<OpenAiTranslationResult> {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
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
              text,
            },
          ],
        },
      ],
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

  return parseTranslationResult(rawText, text);
}
