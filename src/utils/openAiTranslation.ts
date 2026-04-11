import { TranslationMode } from './translationModes';

export type OpenAiTranslationResult = {
  source: string;
  translationEn?: string;
  translationHe?: string;
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
        'Translate the phrase into natural spoken English.',
        'Return only strict JSON.',
        'Schema: {"source":"string","translationEn":"string"}',
        'Do not add markdown.',
        'Do not add explanations.',
      ].join(' ');

    case 'ruToHe':
      return [
        'You are a translation engine for a private mobile app.',
        'The user speaks Russian.',
        'Translate the phrase into natural spoken Hebrew.',
        'Return only strict JSON.',
        'Schema: {"source":"string","translationHe":"string"}',
        'Do not add markdown.',
        'Do not add explanations.',
      ].join(' ');

    case 'ruToEnHe':
      return [
        'You are a translation engine for a private mobile app.',
        'The user speaks Russian.',
        'Translate the phrase into natural spoken English and natural spoken Hebrew.',
        'Return only strict JSON.',
        'Schema: {"source":"string","translationEn":"string","translationHe":"string"}',
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

function parseTranslationResult(rawText: string, originalText: string): OpenAiTranslationResult {
  const parsed = JSON.parse(rawText) as OpenAiTranslationResult;

  return {
    source: parsed.source?.trim() || originalText,
    translationEn: parsed.translationEn?.trim(),
    translationHe: parsed.translationHe?.trim(),
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
