import { Image } from "@/types";
import { useAxiosCommand, useAxiosQuery } from "..";

export function useGetImages(id?: string) {
  const url = id ? `images/users/${id}` : "images";

  return useAxiosQuery<Array<Image>>(url);
}

export function useDeleteImage() {
  return useAxiosCommand({ url: "images", method: "DELETE" });
}

export function useUploadImage() {
  return useAxiosCommand({
    url: "images/users",
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
  });
}
