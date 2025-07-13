const REVIEW_STORAGE_KEY_PREFIX = "reviewed_products_";
import { logger } from "./logger";
export const getReviewedProductIds = (orderId: string): string[] => {
  const key = `${REVIEW_STORAGE_KEY_PREFIX}${orderId}`;
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    logger.error("Failed to parse reviewed products from localStorage", error);
    return [];
  }
};

export const addReviewedProductId = (orderId: string, productId: string): void => {
  const key = `${REVIEW_STORAGE_KEY_PREFIX}${orderId}`;
  const existingIds = getReviewedProductIds(orderId);
  if (!existingIds.includes(productId)) {
    const updatedIds = [...existingIds, productId];
    localStorage.setItem(key, JSON.stringify(updatedIds));
  }
};