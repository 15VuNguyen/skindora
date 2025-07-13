import { AISchemaProduct,AiSuggestedFilterCriteria } from "~/models/types/Ai.types";
import logger from "../logger";
interface UserPreferencesForClientFiltering {
  preferredIngredients?: string[] | null;
}

const aiCategoryToYourCategoryKeywords: {
  [englishAiCategory: string]: string[];
} = {
  cleanser: ["rửa mặt", "làm sạch", "cleansing", "cleanser"],
  toner: ["toner", "nước cân bằng", "nước hoa hồng"],
  moisturizer: [
    "dưỡng ẩm",
    "kem dưỡng",
    "sữa dưỡng",
    "lotion",
    "gel dưỡng",
    "moisturiser",
  ],
  serum: ["serum", "tinh chất"],
  sunscreen: ["chống nắng", "sun protection", "spf", "sun cream", "sun block"],
  exfoliant: [
    "tẩy tế bào chết",
    "tẩy da chết",
    "aha",
    "bha",
    "pha",
    "exfoliating",
    "exfoliator",
  ],
  mask: ["mặt nạ", "mask"],
  spot_treatment: ["chấm mụn", "trị mụn", "spot treatment", "acne treatment"],
  eye_cream: ["kem mắt", "dưỡng mắt", "eye cream"],
  
};

export function applyClientSideFilters(
  productsToFilter: AISchemaProduct[],
  userPrefs: UserPreferencesForClientFiltering,
  aiSuggestions: AiSuggestedFilterCriteria
): AISchemaProduct[] {
  let candidates = [...productsToFilter];

  if (
    userPrefs.preferredIngredients &&
    userPrefs.preferredIngredients.length > 0
  ) {
    logger.info(
      "\n[ClientFilter] Applying user preferred ingredients (checking if ANY preferred ingredient is in string)..."
    );
    const originalCount = candidates.length;
    candidates = candidates.filter((product) => {
      const productIngredientsLower =
        product.Detail.ingredients?.toLowerCase() || "";
      const matchesAtLeastOne = userPrefs.preferredIngredients!.some(
        (userIng) =>
          productIngredientsLower.includes(userIng.trim().toLowerCase())
      );
      if (
        !matchesAtLeastOne &&
        productsToFilter.length === 1 &&
        productsToFilter[0] === product
      ) {
        console.log(
          `[DEBUG ClientFilter] Product "${
            product.name
          }" did NOT contain ANY of the preferred ingredients: [${userPrefs.preferredIngredients!.join(
            ", "
          )}] in its ingredient string.`
        );
        console.log(
          `[DEBUG ClientFilter] Product ingredients (lower snippet): "${productIngredientsLower.substring(
            0,
            200
          )}..."`
        );
      }
      return matchesAtLeastOne;
    });
    logger.info(
      `[ClientFilter] After user preferred ingredients (OR string check): ${candidates.length} products remain (from ${originalCount}).`
    );
    if (candidates.length === 0 && originalCount > 0) {
      logger.warn(
        "[ClientFilter] User preferred ingredients (OR string check) resulted in 0 products."
      );
    }
  }

  const hasRelevantAiCriteria =
    Object.keys(aiSuggestions).length > 0 &&
    (aiSuggestions.suggestedProductCategories?.length ||
      aiSuggestions.keyIngredientsToLookFor?.length ||
      aiSuggestions.ingredientsToAvoid?.length ||
      aiSuggestions.desiredBenefits?.length);

  if (hasRelevantAiCriteria && candidates.length > 0) {
    logger.info(
      "\n[ClientFilter] Applying AI-suggested complementary filters..."
    );
    const countBeforeAIFilters = candidates.length;
    logger.info(`[ClientFilter AI Debug] AI Criteria:`);
    if (aiSuggestions.ingredientsToAvoid?.length)
      logger.info(
        `  Ingredients to Avoid: ${aiSuggestions.ingredientsToAvoid.join(", ")}`
      );
    if (aiSuggestions.suggestedProductCategories?.length)
      logger.info(
        `  Suggested Categories: ${aiSuggestions.suggestedProductCategories.join(
          ", "
        )}`
      );
    if (aiSuggestions.keyIngredientsToLookFor?.length)
      logger.info(
        `  Key Ingredients to Look For: ${aiSuggestions.keyIngredientsToLookFor.join(
          ", "
        )}`
      );
    if (aiSuggestions.desiredBenefits?.length)
      logger.info(
        `  Desired Benefits: ${aiSuggestions.desiredBenefits.join(", ")}`
      );

    candidates = candidates.filter((product) => {
      let score = 0;
      let meetsAiExclusion = true;
      const logsForThisProduct: string[] = []; 

      const productNameLower = product.name?.toLowerCase() || "";
      const productDescLower = product.Detail?.desciption?.toLowerCase() || "";
      const ingredientsTextFromDetail =
        product.Detail?.ingredients?.toLowerCase() || "";

      logsForThisProduct.push(`  Checking Product: "${product.name}"`);

      if (aiSuggestions.ingredientsToAvoid?.length) {
        aiSuggestions.ingredientsToAvoid.forEach((avoidIng) => {
          const avoidIngLower = avoidIng.toLowerCase();
          if (ingredientsTextFromDetail.includes(avoidIngLower)) {
            logsForThisProduct.push(
              `    - Contains ingredient to AVOID: "${avoidIngLower}". EXCLUDING.`
            );
            meetsAiExclusion = false;
          }
        });
      }
      if (!meetsAiExclusion) {
        logger.info(logsForThisProduct.join("\n")); 
        return false;
      }

      if (aiSuggestions.suggestedProductCategories?.length) {
        let categoryMatched = false;
        for (const aiCat of aiSuggestions.suggestedProductCategories) {
          const aiCatLower = aiCat.toLowerCase().replace("_", " ");
          const yourCategoryKeywords =
            aiCategoryToYourCategoryKeywords[aiCatLower];

          if (yourCategoryKeywords && yourCategoryKeywords.length > 0) {
            if (
              yourCategoryKeywords.some((keyword) => {
                const kwLower = keyword.toLowerCase();
                if (
                  productNameLower.includes(kwLower) ||
                  productDescLower.includes(kwLower) ||
                  (product.filter_path_tags &&
                    product.filter_path_tags.some(
                      (tag) =>
                        tag.category_param === "filter_hsk_product_type" &&
                        tag.option_name.toLowerCase().includes(kwLower)
                    ))
                ) {
                  logsForThisProduct.push(
                    `    + Matched AI category "${aiCatLower}" (via keyword "${kwLower}"). Score +2.`
                  );
                  return true; 
                }
                return false;
              })
            ) {
              score += 2;
              categoryMatched = true;
              break; 
            }
          }
        }
        if (!categoryMatched) {
          logsForThisProduct.push(
            `    - No match for AI suggested categories.`
          );
        }
      }

      if (aiSuggestions.keyIngredientsToLookFor?.length) {
        let keyIngredientMatched = false;
        for (const lookForIng of aiSuggestions.keyIngredientsToLookFor) {
          const ingLower = lookForIng.toLowerCase();
          const isNewSuggestion = !userPrefs.preferredIngredients
            ?.map((pi) => pi.trim().toLowerCase())
            .includes(ingLower);
          if (
            isNewSuggestion &&
            (ingredientsTextFromDetail.includes(ingLower) ||
              productDescLower.includes(ingLower))
          ) {
            logsForThisProduct.push(
              `    + Matched AI key ingredient to look for: "${ingLower}". Score +1.`
            );
            score += 1;
            keyIngredientMatched = true;
            
          }
        }
        if (
          !keyIngredientMatched &&
          aiSuggestions.keyIngredientsToLookFor.length > 0
        ) {
          logsForThisProduct.push(
            `    - No match for AI key ingredients to look for.`
          );
        }
      }

      if (aiSuggestions.desiredBenefits?.length) {
        let benefitMatched = false;
        for (const benefit of aiSuggestions.desiredBenefits) {
          const benefitLower = benefit.toLowerCase();
          if (productDescLower.includes(benefitLower)) {
            logsForThisProduct.push(
              `    + Matched AI desired benefit: "${benefitLower}". Score +1.`
            );
            score += 1;
            benefitMatched = true;
           
          }
        }
        if (!benefitMatched && aiSuggestions.desiredBenefits.length > 0) {
          logsForThisProduct.push(`    - No match for AI desired benefits.`);
        }
      }

      const decision = score > 0;
      logsForThisProduct.push(`    Final Score: ${score}. Kept: ${decision}`);
      logger.info(logsForThisProduct.join("\n"));

      return decision; 
    });
    logger.info(
      `[ClientFilter] After AI complementary filters: ${candidates.length} products remain (from ${countBeforeAIFilters}).`
    );

    if (candidates.length === 0 && countBeforeAIFilters > 0) {
      logger.warn(
        "[ClientFilter] AI complementary filters resulted in 0 products. Falling back to list before these AI filters (but after any user preferred ingredient string check)."
      );
      let fallbackCandidates = [...productsToFilter];
      if (
        userPrefs.preferredIngredients &&
        userPrefs.preferredIngredients.length > 0
      ) {
        fallbackCandidates = fallbackCandidates.filter((product) => {
          const productIngredientsLower =
            product.Detail.ingredients?.toLowerCase() || "";
          return userPrefs.preferredIngredients!.some((userIng) =>
            productIngredientsLower.includes(userIng.trim().toLowerCase())
          );
        });
      }
      return fallbackCandidates;
    }
  }
  return candidates;
}
