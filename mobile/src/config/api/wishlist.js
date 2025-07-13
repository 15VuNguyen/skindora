import { API_BASE_URL } from "../base";

export const wishlistEndpoints = {
  add: `${API_BASE_URL}/users/addToWishList`,
  remove: `${API_BASE_URL}/users/removeFromWishList`,
  list: `${API_BASE_URL}/users/getWishList`,
};
