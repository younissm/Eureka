import CookieServices from "./CookieServices";
import { axiosInstance } from "../api/axios.config.js";

export const getCategoriesList = async () => {
  try {
    const { data } = await axiosInstance.get(`/categories`);
    return {data: {categories: data}};
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategory = async (formData) => {
  try {
    const { data } = await axiosInstance.post(`/categories`, formData, {
      headers: {
        Authorization: `Bearer ${CookieServices.get("jwt")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async ({ id, formData }) => {
  try {
    const { data } = await axiosInstance.patch(`/categories/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${CookieServices.get("jwt")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${CookieServices.get("jwt")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
