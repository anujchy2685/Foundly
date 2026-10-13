// authServices.js — auth + profile calls in one place so pages stay thin.
import { rootApi } from "./api";
import { updateStoredUser } from "../utils/user";

export async function register(payload) {
  const { data } = await rootApi.post("/auth/register", payload);
  return data;
}

export async function login({ email, password }) {
  const { data } = await rootApi.post("/auth/login", { email, password });
  if (data?.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("isLoggedIn", "true");
  }
  if (data?.user) updateStoredUser(data.user);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
}

export async function verifyEmail({ email, otp }) {
  const { data } = await rootApi.post("/auth/verify-email", { email, otp });
  return data;
}

export async function resendOtp(email) {
  const { data } = await rootApi.post("/auth/resend-otp", { email });
  return data;
}

export async function getMe() {
  const { data } = await rootApi.get("/user/me");
  if (data?.user) updateStoredUser(data.user);
  return data?.user || null;
}

export async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("profilePicture", file);
  const { data } = await rootApi.post("/user/profile-picture", formData);
  if (data?.user) updateStoredUser(data.user);
  return data;
}
