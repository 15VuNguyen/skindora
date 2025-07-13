import { API_BASE_URL } from "../base";

export const authEndpoints = {
  login: `${API_BASE_URL}/users/login`,
  register: `${API_BASE_URL}/users/register`,
  logout: `${API_BASE_URL}/users/logout`,
  refresh: `${API_BASE_URL}/users/refresh-token`,
  loginGoogle: (code) => `${API_BASE_URL}/users/oauth/google?code=${code}`
};
