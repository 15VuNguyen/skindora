import { LanguageOption } from "~/models/requests/Ai.requests";
import { RoutineSelectionFilterCriteria } from "~/models/types/Ai.types";
// --- DIAGNOSIS PROMPT SYSTEM CONTENT ---
export function getDiagnosisSystemContent(
  availableConcerns: string[],
  budgetVND: number,
  schedulePreference: string,
  language: LanguageOption
): string {
  const langInstruction = language === "vi" ? "Vietnamese" : "English";
  return `You are an expert dermatologist. Your primary task is to analyze the provided image...
- IF THE IMAGE IS NOT A SUITABLE HUMAN FACE... respond ONLY with the following JSON object:
  {"isSuitableImage": false, "rejectionReason": "The uploaded image does not appear to be a clear photo of a human face suitable for skin diagnosis. Please upload a different image.", "diagnosedSkinConcerns": [], "generalObservations": []}
- IF THE IMAGE IS A SUITABLE HUMAN FACE, then proceed with the diagnosis:
  1. Determine their primary skin concern categories from the provided list: ${availableConcerns.join(
    ", "
  )}.
  2. List any specific visual observations about the skin condition. **These observations MUST be in ${langInstruction}.**
  Then, respond with a JSON object containing these keys: "isSuitableImage": true, "diagnosedSkinConcerns" (these will likely be in the language of 'availableConcerns' list), and "generalObservations" (in ${langInstruction}).
Example (if ${langInstruction} is English and availableConcerns are English):
  {"isSuitableImage": true, "diagnosedSkinConcerns": ["Oily Skin", "Acne"], "generalObservations": ["Visible redness around the nose...", "Some active inflamed pimples..."]}
Example (if ${langInstruction} is Vietnamese and availableConcerns are Vietnamese):
  {"isSuitableImage": true, "diagnosedSkinConcerns": ["Da dầu/Hỗn hợp dầu", "Da mụn"], "generalObservations": ["Quan sát thấy đỏ quanh mũi...", "Một vài nốt mụn viêm sưng..."]}

The user's budget is approximately ${budgetVND} VND. They are interested in a ${schedulePreference}.`;
}

// --- AI FILTER SUGGESTION PROMPT SYSTEM CONTENT ---
export function getFilterSuggestionSystemContent(): string {
  return `You are a knowledgeable skincare expert. Based on the user's diagnosed skin concerns and specific skin observations, your task is to suggest criteria for selecting suitable skincare products.
Focus on identifying:
- Relevant product categories (e.g., cleanser, toner, moisturizer, serum, sunscreen, spot treatment, exfoliant). Use English terms for categories where possible to align with potential product data structure (e.g., "acne_treatment" instead of "chấm mụn").
- Key beneficial ingredients to look for (e.g., Salicylic Acid, Niacinamide, Tea Tree Oil).
- Specific ingredients to avoid, if any are particularly relevant to the concerns/observations.
- Desired product attributes or benefits (e.g., "oil-control", "hydrating", "pore-minimizing", "non-comedogenic", "lightweight texture", "soothing").
Respond ONLY with a valid JSON object with the following keys: "suggestedProductCategories" (array of strings), "keyIngredientsToLookFor" (array of strings), "ingredientsToAvoid" (array of strings), and "desiredBenefits" (array of strings).
Keep ingredient names in English for easier matching later. Benefits can be short English phrases.`;
}

// --- ROUTINE SELECTION PROMPT SYSTEM CONTENT ---
export function getRoutineSelectionSystemContent(
  productCountGuidance: string, 
  budgetVND: number, // 2
  diagnosedConcernOrConcerns: string | string[], // 3
  schedulePreference: string, // 4
  filterCriteria?: RoutineSelectionFilterCriteria // 5 
): string {
  const concernText = Array.isArray(diagnosedConcernOrConcerns)
    ? diagnosedConcernOrConcerns.join('", "')
    : diagnosedConcernOrConcerns;

  let preFilterContext = "";
  let hasUserPrefs = false;
  if (filterCriteria?.userPreferences) {
    const activeUserPrefs: { [key: string]: any } = {};
    const prefKeys: (keyof typeof filterCriteria.userPreferences)[] = [
      "userPreferredSkinType",
      "preferredBrands",
      "preferredIngredients",
      "preferredOrigins",
      "preferredProductTypes",
      "preferredUses",
      "preferredCharacteristics",
      "preferredSizes",
      "language",
    ];
    prefKeys.forEach((key) => {
      const value = filterCriteria.userPreferences![key];
      if (Array.isArray(value) && value.length > 0) {
        activeUserPrefs[key] = value;
      } else if (
        !Array.isArray(value) &&
        value != null &&
        String(value).trim() !== ""
      ) {
        activeUserPrefs[key] = value;
      }
    });
    if (Object.keys(activeUserPrefs).length > 0) hasUserPrefs = true;
  }

  let hasAiSuggestions = false;
  if (filterCriteria?.aiSuggestions) {
    if (
      Object.values(filterCriteria.aiSuggestions).some((val) =>
        Array.isArray(val) ? val.length > 0 : val != null
      )
    ) {
      hasAiSuggestions = true;
    }
  }

  if (hasUserPrefs || hasAiSuggestions) {
    const contextParts: string[] = [];
    if (hasUserPrefs) {
      contextParts.push(`User preferences were considered.`);
    }
    if (hasAiSuggestions) {
      contextParts.push(`AI suggestions were also considered.`);
    }
    preFilterContext = `The provided product list has been refined based on ${contextParts.join(
      " and "
    )} Please select products that best align.`;
  }

  let scheduleGuidanceForSelection = "";
  if (schedulePreference === "AM") {
    scheduleGuidanceForSelection =
      "The user is looking for an AM (morning) routine. Prioritize products suitable for morning use, such as cleansers, lightweight moisturizers, serums with antioxidants (like Vitamin C), and especially sunscreen. Avoid selecting products typically exclusive to nighttime use (e.g., heavy night creams, strong retinoids unless specifically indicated for AM with sunscreen).";
  } else if (schedulePreference === "PM") {
    scheduleGuidanceForSelection =
      "The user is looking for a PM (evening) routine. Prioritize products suitable for evening use, such as makeup removers, cleansers, treatments (like retinoids, exfoliants), and appropriate moisturizers. Sunscreen is generally not needed for a PM-only routine.";
  } else {
    // AM/PM
    scheduleGuidanceForSelection =
      "The user is looking for a comprehensive AM and PM routine. Select products that cover both morning and evening needs.";
  }

  return `You are an expert skincare routine builder.
Your goal is to select a set of products (typically ${productCountGuidance}) from the provided list that form a comprehensive and highly effective routine for the diagnosed skin concern(s) ("${concernText}"), the user's **specific schedule preference ("${schedulePreference}")**, and within the total budget.
${scheduleGuidanceForSelection}
The *total combined price* of all products you select MUST NOT exceed ${budgetVND} VND.
${preFilterContext}
Instructions:
1.  **Strictly adhere to the user's schedule preference ("${schedulePreference}") when selecting product types.**
2.  Select essential products first, then supplementary if budget allows.
3.  Do not exceed the total budget.
4.  Respond ONLY with a JSON object containing a single key "selectedProductNames", an array of strings. These strings MUST BE THE *EXACT* product names as provided in the input list.
    Example: {"selectedProductNames": ["Exact Product Name A from List", "Exact Product Name B from List"]}`;
}

// --- FULL ROUTINE RECOMMENDATION PROMPT SYSTEM CONTENT ---
function getFullRoutineRecommendationJsonStructureDefinition(
  language: LanguageOption
): string {
  const langDesc = language === "vi" ? "VIETNAMESE" : "ENGLISH";
  return `{
  "routineRecommendation": {
    "diagnosedConcernCategories": ["string array (from input, preserve original language)"],
    "generalSkinObservations": ["string array (in ${langDesc}, from diagnosis step)"],
    "schedulePreference": "string (User's preference)",
    "totalRoutineCostVND": "number (Calculated total cost)",
    "originalBudgetVND": "number (User's original budget)",
    "fitsOverallBudget": "boolean (Calculated)",
    "overallRoutineRationale": "string (${langDesc}: Why this combination is good.)",
    "productsInRoutine": [
      {
        "productName": "string (Original product name)",
        "brand": "string (Original brand name)",
        "priceVND": "string (Product's price)",
        "roleInRoutine": "string (${langDesc}: e.g., 'Cleanser' or 'Sữa rửa mặt')",
        "reasoningForInclusion": "string (${langDesc}: Specific reasons this product fits.)",
        "keyIngredients": [
          { "ingredient": "string (Ingredient name, can be English/scientific)", "benefit": "string (${langDesc}: Benefit)" }
        ],
        "usageInstructions": {
          "applicationNotes": "string (${langDesc}: Based on product's HowToUse)",
          "frequency": "string (${langDesc}: e.g., 'Daily, AM & PM' or 'Hàng ngày sáng & tối')"
        },
        "productUrl": "string (Use the URL provided)"
      }
    ],
    "suggestedOrderAM": ["string array (List original product names for AM routine)"],
    "suggestedOrderPM": ["string array (List original product names for PM routine)"],
    "additionalTips": "string (${langDesc}: General tips)"
  }
}`;
}

export function getFullRoutineRecommendationSystemContent(
  diagnosedConcernsArray: string[],
  generalSkinObservations: string[],
  budgetVND: number,
  schedulePreference: string,
  totalRoutineCost: number,
  fitsBudget: boolean,
  language: LanguageOption
): string {
  const jsonStructure =
    getFullRoutineRecommendationJsonStructureDefinition(language);
  const langInstruction = language === "vi" ? "VIETNAMESE" : "ENGLISH";

  let scheduleSpecificInstructions = "";
  if (schedulePreference === "AM") {
    scheduleSpecificInstructions = `User wants an AM (morning) routine. "suggestedOrderPM" MUST be an empty array: []. "suggestedOrderAM" should list AM products.`;
  } else if (schedulePreference === "PM") {
    scheduleSpecificInstructions = `User wants a PM (evening) routine. "suggestedOrderAM" MUST be an empty array: []. "suggestedOrderPM" should list PM products.`;
  } else {
    scheduleSpecificInstructions = `User wants AM and PM. Populate both "suggestedOrderAM" and "suggestedOrderPM".`;
  }

  return `You are a skincare expert. Provide a detailed recommendation in a valid JSON object.
**ALL textual explanations, reasons, benefits, instructions, and tips MUST be in ${langInstruction.toUpperCase()}.**
JSON field names MUST remain in English as specified in the structure.
Output JSON structure:
${jsonStructure}

IMPORTANT JSON FORMATTING RULES:
- Ensure all strings are properly escaped.
- Ensure all arrays are correctly formatted (e.g., ["item1", "item2"]).
- If an array like "suggestedOrderPM" is meant to be empty based on instructions, represent it as an empty array: [].
- No trailing commas before a closing brace } or bracket ].

**Crucial Instruction Regarding Schedule: The user's schedule preference is "${schedulePreference}". ${scheduleSpecificInstructions}**
Diagnosed concerns (preserve original language): ${diagnosedConcernsArray.join(
    ", "
  )}.
General skin observations (should be in ${langInstruction}): ${generalSkinObservations.join(
    ", "
  )}.
Budget: ${budgetVND} VND. Routine cost: ${totalRoutineCost} VND. Fits budget: ${fitsBudget}.
Base your ${langInstruction} reasoning on provided product details.`;
}
