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
      onProgressCallback(percentCompleted);
    },
  });

  return response.data;
}

export async function mediaDeleteService(id) {
  const response = await axiosInstance.delete(
    `api/v1/media/delete/${encodeURIComponent(id)}`
  );

  return response.data;
}

export async function addNewCourseService(newCourseData) {
  const response = await axiosInstance.post(
    "/api/v1/instructor/course/add",
    newCourseData
  );

  return response.data;
}

export async function fetchInstructorCourseListService() {
  const response = await axiosInstance.get("/api/v1/instructor/course/get");

  return response.data;
}
export async function fetchInstructorCourseDetailsByIdService(id) {
  const response = await axiosInstance.get(
    `/api/v1/instructor/course/get/details/${id}`
  );

  return response.data;
}
export async function updateInstructorCourseByIdService(id, formdata) {
  const response = await axiosInstance.put(
    `/api/v1/instructor/course/update/${id}`,
    formdata
  );

  return response.data;
}

export async function bulkMediaUploadService(formData, onProgressCallback) {
  const response = await axiosInstance.post(
    "api/v1/media/bulk-upload",
    formData,
    {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgressCallback(percentCompleted);
      },
    }
  );

  return response.data;
}

export async function fetchStudentViewCourseListService(query) {
  const response = await axiosInstance.get(
    `/api/v1/student/course/get${query}`
  );

  return response.data;
}
export async function fetchStudentViewCourseDetailsByIdService(id) {
  const response = await axiosInstance.get(
    `/api/v1/student/course/get/details/${id}`
  );
  return response?.data;
}

export async function createPaymentService(formdata) {
  const { data } = await axiosInstance.post(`api/v1/student/order/create`, formdata);

  return data;
}

export async function captureAndFinalizePaymentService(formdata) {
  const { data } = await axiosInstance.post(`api/v1/student/order/capture`, formdata);

  return data;
}
