// api.js — shared HTTP clients for the whole app.
//
// Backend layout:
//   /api/...   -> items, admin (API_URL)
//   /auth/...  -> register, login, verify (API_ROOT)
//   /user/...  -> profile (API_ROOT)
import axios from "axios";

export const API_URL = (
  import.meta.env?.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export const API_ROOT = API_URL.replace(/\/api\/?$/, "");

const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

// For /api/* resources (lost-items, found-items, admin)
export const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use(attachToken);

// For root-mounted resources (/auth/*, /user/*)
export const rootApi = axios.create({ baseURL: API_ROOT });
rootApi.interceptors.request.use(attachToken);

// Normalize axios failures into Errors with an HTTP status attached.
export function httpError(err, fallback = "Request failed") {
  const status = err.response?.status;
  const message =
    err.response?.data?.message ||
    (status ? `${fallback} (${status})` : "Cannot connect to server");
  const error = new Error(message);
  error.status = status;
  return error;
}
