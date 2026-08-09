import CookieServices from "./CookieServices";
import { axiosInstance } from "../api/axios.config.js";

export const getProductList = async () => {
  try {
    const { data } = await axiosInstance.get(`/products`);
    return {data: {products: data}};
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return {data: {product: data}};
  } catch (error) {
    console.error("Error fetching product :", error);
    throw error;
  }
};

export const getCategoryProduct = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/categories/${id}/products`);
    return { data: {products: data}};
  } catch (error) {
    console.error("Error fetching product of the category :", error);
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const { data } = await axiosInstance.post(`/products`, formData, {
      headers: {
        Authorization: `Bearer ${CookieServices.get("jwt")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async ({ id, formData }) => {
  try {
    const { data } = await axiosInstance.patch(`/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${CookieServices.get("jwt")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${CookieServices.get("jwt")}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
