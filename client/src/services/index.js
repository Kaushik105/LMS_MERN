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

  return response.data
}


export async function checkAuthService(formData) {
  const response = await axiosInstance.get("api/v1/auth/check-auth");

  return response.data;
}

export async function mediaUploadService(formData) {
  console.log(formData.get('file'));
  
  
  const response = await axiosInstance.post("api/v1/media/upload",formData);

  return response.data;
}
