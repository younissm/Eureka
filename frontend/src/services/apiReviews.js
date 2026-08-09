import CookieServices from "./CookieServices";
import { axiosInstance } from "../api/axios.config.js";

export const getReviewsList = async () => {
  try {
    const { data } = await axiosInstance.get(`/reviews`);
    return {data: {reviews: data}};
  } catch (error) {
    console.error("Error fetching reviews list:", error);
    throw error;
  }
};

export const getProductReviews = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}/reviews`);
    return {data: {reviews: data}};
  } catch (error) {
    console.error("Error fetching reviews list:", error);
    throw error;
  }
};

export const createReview = async ({ id, body }) => {
  try {
    const { data } = await axiosInstance.post(`/products/${id}/reviews`, body, {
      headers: {
        Authorization: `Bearer ${CookieServices.get("jwt")}`,
      },
    });
    return {data: {reviews: data}};
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const deleteReview = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${CookieServices.get("jwt")}`,
      },
    });
    return {data: {reviews: data}};
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

export const updateReview = async ({ id, body }) => {
  try {
    const { data } = await axiosInstance.patch(`/reviews/${id}`, body, {
      headers: {
        Authorization: `Bearer ${CookieServices.get("jwt")}`,
      },
    });
    return {data: {reviews: data}};
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};
