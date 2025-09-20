import OpenAI from 'openai'
import { LanguageOption } from '~/models/requests/Ai.requests'
import { AISchemaProduct, RoutineSelectionFilterCriteria } from '../../../models/types/Ai.types'
import {
  getDiagnosisSystemContent,
  getFilterSuggestionSystemContent,
  getRoutineSelectionSystemContent,
  getFullRoutineRecommendationSystemContent
} from './systemPrompts'

import {
  getDiagnosisUserText,
  getFilterSuggestionUserContent,
  getRoutineSelectionUserContent,
  getFullRoutineRecommendationUserContent
} from './userPrompts' 

export function createDiagnosisPrompt(
  base64OrDataUrl: string,
  budgetVND: number,
  schedulePreference: string,
  availableConcerns: string[],
  language: LanguageOption
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const finalImageUrl: string = base64OrDataUrl.startsWith('data:image')
    ? base64OrDataUrl
    : `data:image/jpeg;base64,${base64OrDataUrl}`
  const systemContent = getDiagnosisSystemContent(availableConcerns, budgetVND, schedulePreference, language)
  const userText = getDiagnosisUserText(budgetVND, schedulePreference, availableConcerns)
  return [
    { role: 'system', content: systemContent },
    {
      role: 'user',
      content: [
        { type: 'text', text: userText },
        {
          type: 'image_url',
          image_url: { url: finalImageUrl, detail: 'auto' }
        }
      ]
    }
  ]
}

export function createFilterSuggestionPrompt(
  diagnosedSkinConcerns: string[],
  generalObservations: string[]
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const systemContent = getFilterSuggestionSystemContent()
  const userContent = getFilterSuggestionUserContent(diagnosedSkinConcerns, generalObservations)
  return [
    { role: 'system', content: systemContent },
    { role: 'user', content: userContent }
  ]
}

export function createRoutineSelectionPrompt(
  potentialProductsSummary: Array<{
    name: string
    price: string
    description?: string
  }>, 
  diagnosedConcernOrConcerns: string | string[], 
  budgetVND: number,
  schedulePreference: string, 
  filterCriteria?: RoutineSelectionFilterCriteria 
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const productListingForPrompt = potentialProductsSummary
    .map(
      (p, index) =>
        `${index + 1}. Name: "${p.name}", Price: ${p.price} VND ${
          p.description ? ', Desc (snippet): ' + p.description.substring(0, 100) + '...' : ''
        }`
    )
    .join('\n')

  let productCountGuidance = '3-5 products'
  if (budgetVND > 2000000) {
    productCountGuidance = '8-16 products, including specialized treatments if beneficial'
  } else if (budgetVND > 1000000) {
    productCountGuidance = '3-8 products, possibly including a serum or treatment'
  } else if (budgetVND < 500000) {
    productCountGuidance = '2-4 essential products'
  }

  const systemContent = getRoutineSelectionSystemContent(
    productCountGuidance,
    budgetVND,
    diagnosedConcernOrConcerns,
    schedulePreference,
    filterCriteria 
  )
  const userContent = getRoutineSelectionUserContent(
    diagnosedConcernOrConcerns,
    budgetVND,
    schedulePreference,
    productListingForPrompt,
    productCountGuidance
  )

  return [
    { role: 'system', content: systemContent },
    { role: 'user', content: userContent }
  ]
}

export function createFullRoutineRecommendationJsonPrompt(
  selectedProductsDetails: AISchemaProduct[],
  diagnosedConcernsArray: string[],
  generalSkinObservations: string[],
  budgetVND: number,
  schedulePreference: string,
  language: LanguageOption
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const totalRoutineCost = selectedProductsDetails.reduce(
    (acc, p) => acc + parseInt(p.price.replace(/\D/g, '') || '0'),
    0
  )
  const fitsBudget = totalRoutineCost <= budgetVND
  const productDetailsString = selectedProductsDetails
    .map(
      (p) =>
        `- Name: ${p.name}, Brand: ${p.brand}, Price: ${p.price} VND, URL: ${p.urlDetail}, Ingredients: ${p.Detail.ingredients}, HowToUse: ${p.Detail.howToUse}, Description: ${p.Detail.desciption}`
    )
    .join('\n---\n')

  const systemContent = getFullRoutineRecommendationSystemContent(
    diagnosedConcernsArray,
    generalSkinObservations,
    budgetVND,
    schedulePreference,
    totalRoutineCost,
    fitsBudget,
    language
  )
  const userContent = getFullRoutineRecommendationUserContent(
    diagnosedConcernsArray,
    generalSkinObservations,
    budgetVND,
    schedulePreference,
    productDetailsString,
    language
  )
  return [
    { role: 'system', content: systemContent },
    { role: 'user', content: userContent }
  ]
}
export function createWeeklyScheduleGenerationPrompt(
  productsInRoutine: { name: string; id: string; howToUse: string }[],
  schedulePreference: 'AM' | 'PM' | 'AM/PM',
  language: 'vi' | 'en'
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const langInstruction = language === 'vi' ? 'Vietnamese' : 'English';
  const productListString = productsInRoutine
    .map((p) => `- Product Name: "${p.name}", Product ID: "${p.id}", Instructions: "${p.howToUse}"`)
    .join('\n');

  const systemContent = `
You are a skincare routine scheduler. Your task is to create a weekly skincare schedule based on a list of products and a user's preference.

**Instructions:**
1.  Analyze the products, paying attention to instructions about frequency (e.g., "use 2-3 times a week", "use daily").
2.  Create a 7-day schedule (Monday to Sunday).
3.  For each day, specify which products to use in the "AM" and "PM" slots.
4.  If a product is for daily use, include it every day in the appropriate AM/PM slot(s).
5.  If a product is for limited use (e.g., an exfoliant like BHA/AHA), distribute it across the week (e.g., Tuesday, Thursday, Saturday). **Do not schedule strong exfoliants on consecutive days.**
6.  The user's preference is "${schedulePreference}". If they only want "AM", the "PM" slots should be empty arrays. If they only want "PM", the "AM" slots should be empty arrays.
7.  The keys for the days of the week **MUST be in English**: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday".
8.  The keys for the time slots **MUST be**: "AM", "PM".
9.  The value for each time slot must be an array of **Product IDs**.

**Respond ONLY with a valid JSON object** that strictly follows this format:
{
  "schedule": {
    "Monday": { "AM": ["product_id_1"], "PM": ["product_id_2", "product_id_3"] },
    "Tuesday": { "AM": ["product_id_1"], "PM": ["product_id_2", "product_id_4"] },
    ...and so on for all 7 days
  }
}
Example for an AM-only routine:
{
  "schedule": {
    "Monday": { "AM": ["product_id_1", "product_id_5"], "PM": [] },
    ...
  }
}
`;

  const userContent = `
Here are the products for the routine. Please generate the weekly schedule JSON based on these.

**Products:**
${productListString}
`;

  return [
    { role: 'system', content: systemContent },
    { role: 'user', content: userContent }
  ];
}