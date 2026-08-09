import { axiosInstance } from "../api/axios.config";

export const signup = async (formData) => {
  try {
    const { data } = await axiosInstance.post(`/users/signup`, formData);
    return data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};
