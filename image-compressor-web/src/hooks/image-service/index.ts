import { Image } from "@/types";
import { useAxiosCommand, useAxiosQuery } from "..";

export function useGetImages() {
  return useAxiosQuery<Array<Image>>({ url: "images" });
}

export function useDeleteImage() {
  return useAxiosCommand({ url: "images", method: "DELETE" });
}

export function useUploadImage() {
  return useAxiosCommand({
    url: "images",
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
  });
}
