// src/services/api.js
import axios from "axios";
import { getToken, getRefreshToken, setToken, setRefreshToken, clearAuth } from "./auth_service";

const api = axios.create({
  baseURL: "https://eelu-test.runasp.net/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue = [];

function processQueue(error, token = null) {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  queue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    if (status !== 401 || original?._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuth();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post(
        "https://eelu-test.runasp.net/api/authentication_/Refresh",
        { refreshToken }
      );

      const newToken = data?.token;
      const newRefresh = data?.refreshToken;

      if (newToken) setToken(newToken);
      if (newRefresh) setRefreshToken(newRefresh);

      processQueue(null, newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (e) {
      processQueue(e, null);
      clearAuth();
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;