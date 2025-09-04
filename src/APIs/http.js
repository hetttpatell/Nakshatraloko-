// src/apis/http.js
import axios from "axios";
import.meta.env.VITE_API_URL

// ---- Base URL from env ----
const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  "";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: false,
});

function getToken() {
  return localStorage.getItem("token");
}

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = config.headers["Content-Type"] || "application/json";
    }
    config.headers.Accept = config.headers.Accept || "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const unified = new Error(
      error?.response?.data?.message ||
      error?.response?.data?.error?.message ||
      error?.message ||
      "Unknown error"
    );
    unified.status = error?.response?.status;
    unified.data = error?.response?.data;
    return Promise.reject(unified);
  }
);

// ---- Helper methods ----
export const get = (url, params = {}, config = {}) =>
  api.get(url, { params, ...config }).then((r) => r.data);

export const post = (url, data = {}, config = {}) =>
  api.post(url, data, config).then((r) => r.data);

export const put = (url, data = {}, config = {}) =>
  api.put(url, data, config).then((r) => r.data);

export const patch = (url, data = {}, config = {}) =>
  api.patch(url, data, config).then((r) => r.data);

export const del = (url, params = {}, config = {}) =>
  api.delete(url, { params, ...config }).then((r) => r.data);

export { api };
