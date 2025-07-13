import { LanguageOption } from "~/models/requests/Ai.requests";

// --- DIAGNOSIS PROMPT USER TEXT ---
export function getDiagnosisUserText(
  budgetVND: number,
  schedulePreference: string,
  availableConcerns: string[]
): string {
  return `Please analyze my skin from the image, noting any specific visual characteristics and skin concern categories. My budget is around ${budgetVND} VND, and I need products for my ${schedulePreference}. Available skin concern categories: ${availableConcerns.join(
    ", "
  )}. Follow the system instructions precisely regarding image suitability and JSON output format.`;
}

// --- AI FILTER SUGGESTION PROMPT USER CONTENT ---
export function getFilterSuggestionUserContent(
  diagnosedSkinConcerns: string[],
  generalObservations: string[]
): string {
  return `My diagnosed skin concern(s) are: "${diagnosedSkinConcerns.join(
    '", "'
  )}".
My specific skin observations are:
${generalObservations.map((obs) => `- ${obs}`).join("\n")}
Based on this, please provide a JSON object suggesting product categories, key ingredients to look for, any ingredients to avoid, and desired product benefits to help me filter for the most suitable products. For example, for oily, acne-prone skin, you might suggest categories like 'cleanser', 'acne_treatment', ingredients like 'Salicylic Acid', and benefits like 'oil control'.`;
}

// --- ROUTINE SELECTION PROMPT USER CONTENT ---
export function getRoutineSelectionUserContent(
  diagnosedConcernOrConcerns: string | string[],
  budgetVND: number,
  schedulePreference: string,
  productListingForPrompt: string,
  productCountGuidance: string
): string {
  const concernText = Array.isArray(diagnosedConcernOrConcerns)
    ? diagnosedConcernOrConcerns.join('", "')
    : diagnosedConcernOrConcerns;

  return `My diagnosed skin concern(s) are: "${concernText}".
My total budget for the entire skincare routine is: ${budgetVND} VND.
My schedule preference is: "${schedulePreference}".
Here is a list of available products:
${productListingForPrompt}

Please select a set of products (typically ${productCountGuidance}) from this list to create a comprehensive and highly effective skincare routine for me. Ensure the total cost is within my budget. Return only the JSON object with the "selectedProductNames" array.`;
}

// --- FULL ROUTINE RECOMMENDATION PROMPT USER CONTENT ---
export function getFullRoutineRecommendationUserContent(
  diagnosedConcernsArray: string[],
  generalSkinObservations: string[],
  budgetVND: number,
  schedulePreference: string,
  productDetailsString: string,
  language: LanguageOption
): string {
  const langInstruction = language === "vi" ? "VIETNAMESE" : "ENGLISH";
  return `My diagnosed skin concerns are: "${diagnosedConcernsArray.join(
    '", "'
  )}".
My general skin observations (in ${langInstruction}, from previous step) are: "${generalSkinObservations.join(
    '", "'
  )}".
My total budget is ${budgetVND} VND, schedule preference: "${schedulePreference}".
Output language for explanations should be ${langInstruction.toUpperCase()}.
Product details for the routine:
${productDetailsString}

Please provide the detailed JSON recommendation. Ensure all generated explanatory text (rationale, roles, reasons, benefits, usage, tips) is in ${langInstruction.toUpperCase()}, following the system guidelines.`;
}
