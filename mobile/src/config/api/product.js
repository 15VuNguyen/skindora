export const productEndpoints = {
  list: `/products/get-all`,
  detail: (id) => `/products/${id}`,
  add: `/products`,
  update: (id) => `/products/${id}`,
  delete: (id) => `/products/${id}`,
};
