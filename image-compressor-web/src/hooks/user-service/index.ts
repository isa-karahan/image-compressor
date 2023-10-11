import { CreateUser, PagedList, User } from "@/types";
import { useAxiosCommand, useAxiosQuery } from "@/hooks";

export function useGetUsers(params?: object) {
  return useAxiosQuery<PagedList<User>>({ url: "users", params });
}

export function useGetOccupations() {
  return useAxiosQuery<Array<string>>({ url: "users/profession" });
}

export function useCreateUser() {
  return useAxiosCommand({ url: "users", method: "POST" });
}

export function useDeleteUser() {
  return useAxiosCommand({ url: "users", method: "DELETE" });
}

export function useUpdateUser() {
  return useAxiosCommand({ url: "users", method: "PUT" });
}
