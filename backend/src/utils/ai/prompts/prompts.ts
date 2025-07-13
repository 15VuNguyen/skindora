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
