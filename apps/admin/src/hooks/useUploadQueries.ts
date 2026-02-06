import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { apiClient } from "../services/api";

export const useUploadFile = () => {
  return useMutation<{ url: string }, Error, File>({
    mutationFn: (file) => apiClient.upload.file(file),
    onSuccess: () => {
      message.success("Файл успішно завантажено!");
    },
    onError: (error) => {
      message.error(`Помилка завантаження файлу: ${error.message}`);
    },
  });
};

export const useDeleteFile = () => {
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (url) => apiClient.upload.delete(url),
    onSuccess: () => {
      message.success("Файл видалено.");
    },
    onError: (error) => {
      message.error(`Помилка видалення файлу: ${error.message}`);
    },
  });
};
