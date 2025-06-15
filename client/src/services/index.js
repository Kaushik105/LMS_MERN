import { axiosInstance } from "@/api/axiosInstance";

export async function registerService(formData) {
  const response = await axiosInstance.post("api/v1/auth/register", {
    ...formData,
    role: "user",
  });

  return response.data;
}

export async function loginService(formData) {
  const response = await axiosInstance.post("api/v1/auth/login", formData);

  return response.data;
}

export async function checkAuthService(formData) {
  const response = await axiosInstance.get("api/v1/auth/check-auth");

  return response.data;
}

export async function mediaUploadService(formData, onProgressCallback) {
  const response = await axiosInstance.post("api/v1/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );      
      onProgressCallback(percentCompleted)
    },
  });

  return response.data;
}
