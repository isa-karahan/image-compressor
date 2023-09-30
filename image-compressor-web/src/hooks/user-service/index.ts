import { CreateUser, User } from "@/types";
import { useAxiosCommand, useAxiosQuery } from "..";

export function useGetUsers() {
  return useAxiosQuery<Array<User>>("users");
}

export function useGetOccupations() {
  return useAxiosQuery<Array<string>>("users/profession");
}

export function useCreateUser() {
  return useAxiosCommand<CreateUser>({ url: "users", method: "POST" });
}

export function useDeleteUser() {
  return useAxiosCommand({ url: "users", method: "DELETE" });
}

export function useUpdateUser() {
  return useAxiosCommand({ url: "users", method: "PUT" });
}
