import httpClient from "@/lib/axios";
import type { User } from "@/types/user";

export const fetchListUser = async (limit?: number, page?: number) => {
  return await httpClient
    .get<API.IResponseSearch<User>>(`/admin/manage-users/get-all`, {
      limit: limit,
      page: page,
    })
    .then((res) => res.data);
};
// export const fetchUserById = async (id: string) => {
//   return await httpClient.get<API.IResponse<User>>(`/user/${id}`).then((res) => res.data);
// };
// export const createUser = async (data: User) => {
//   return await httpClient.post<API.IResponse<User>>("/user", data).then((res) => res.statusText);
// };
// export const updateUser = async (id: string, data: User) => {
//   return await httpClient.put<API.IResponse<User>>(`/user/${id}`, data).then((res) => res.statusText);
// };
