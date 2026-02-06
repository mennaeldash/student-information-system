// src/services/auth_service.js

const API_BASE = "https://eelu-test.runasp.net";

const ACCESS_KEY = "token";
const REFRESH_KEY = "refreshToken";
const REFRESH_EXP_KEY = "refreshTokenExpires"; 

function setAuthTokens({ token, refreshToken, refreshTokenExpires }) {
  if (token) localStorage.setItem(ACCESS_KEY, token);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  if (refreshTokenExpires) localStorage.setItem(REFRESH_EXP_KEY, refreshTokenExpires);
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(REFRESH_EXP_KEY);
  localStorage.removeItem("profileData");
  localStorage.removeItem("student_id");
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

function isTokenExpiringSoon(token, skewSeconds = 60) {
  const payload = parseJwt(token);
  const exp = payload?.exp;
  if (!exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return exp - now <= skewSeconds;
}

export async function login(student_id, password) {
  try {
    const response = await fetch(`${API_BASE}/api/authentication_/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id, password }),
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      const err = new Error(`HTTP ${response.status}`);
      err.status = response.status;
      err.body = data;
      throw err;
    }

    setAuthTokens({
      token: data?.token,
      refreshToken: data?.refreshToken,
      refreshTokenExpires: data?.refreshTokenExpires,
    });

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}


export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    const err = new Error("No refresh token found");
    err.status = 401;
    throw err;
  }

  const response = await fetch(`${API_BASE}/api/authentication_/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const err = new Error(`HTTP ${response.status}`);
    err.status = response.status;
    err.body = data;
    throw err;
  }

  setAuthTokens({
    token: data?.token,
    refreshToken: data?.refreshToken || refreshToken,
    refreshTokenExpires: data?.refreshTokenExpires,
  });

  return data;
}

export async function getValidAccessToken() {
  const token = getAccessToken();
  if (!token) return null;

  if (!isTokenExpiringSoon(token, 60)) return token;

  const refreshed = await refreshAccessToken();
  return refreshed?.token || getAccessToken();
}


export async function authFetch(url, options = {}) {
  const token = await getValidAccessToken();

  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...options, headers });

  if (res.status !== 401) return res;

  try {
    await refreshAccessToken();
  } catch (e) {
    clearAuthTokens();
    throw e;
  }

  const token2 = getAccessToken();
  const headers2 = new Headers(options.headers || {});
  if (token2) headers2.set("Authorization", `Bearer ${token2}`);

  return fetch(url, { ...options, headers: headers2 });
}
