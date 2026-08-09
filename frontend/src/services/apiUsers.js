import CookieServices from "./CookieServices";
import { axiosInstance } from "../api/axios.config.js";

export const getUsersList = async () => {
  try {
    const { data } = await axiosInstance.get(`/users`, {
        headers: {
          Authorization: `Bearer ${CookieServices.get("jwt")}`,
        },
      }
    );
    return { data: {users: data}};
  } catch (error) {
    console.error("Error fetching users list:", error);
    throw error;
  }
};

export const getMyUser = async () => {
  try {
    const { data } = await axiosInstance.get(`/users/me`, {
      headers: {
        Authorization: `Bearer ${CookieServices.get("jwt")}`,
      },
    });
    return { data: {user: data}};
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateMe = async (formData) => {
  try {
    const { data } = await axiosInstance.patch(`/users/updateMe`, formData, {
      headers: {
        Authorization: `Bearer ${CookieServices.get("jwt")}`,
      },
    });
    return { data: {user: data}};
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateUser = async ({ id, formData }) => {
  try {
    const { data } = await axiosInstance.patch(`/users/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${CookieServices.get("jwt")}`,
      },
    });

    return { data: {user: data}};
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateMyPassword = async (body) => {
  try {
    const { data } = await axiosInstance.patch(
      `/users/updateMyPassword`,
      body,
      {
        headers: {
          Authorization: `Bearer ${CookieServices.get("jwt")}`,
        },
      }
    );
    return { data: {user: data}};
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${CookieServices.get("jwt")}`,
      },
    });
    return { data: {user: data}};
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const forgotPassword = async (body) => {
  try {
    const { data } = await axiosInstance.post(`/users/forgotPassword`, body);
    return { data: {user: data}};
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
export const resetPassword = async ({ body, token }) => {
  try {
    const { data } = await axiosInstance.patch(
      `/users/resetPassword/${token}`,
      body
    );
    return { data: {user: data}};
  } catch (error) {
    console.error("Error reseting password:", error);
    throw error;
  }
};
