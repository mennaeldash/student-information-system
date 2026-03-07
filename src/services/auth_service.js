// src/services/auth_service.js
import api from "./api";

export const TOKEN_KEY = "token";
export const PROFILE_KEY = "profileData";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const REFRESH_EXPIRES_KEY = "refreshTokenExpires";

export function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
  } catch {
    return null;
  }
}

export function setRefreshToken(refreshToken) {
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_EXPIRES_KEY);
  localStorage.removeItem("student_id");
}

export function getUserRole() {
  const token = getToken();
  const payload = token ? parseJwt(token) : null;

  const roleClaim =
    payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    payload?.role ??
    payload?.Role ??
    payload?.userRole ??
    payload?.type ??
    payload?.roles ??
    payload?.Roles;

  const role = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim;
  return role ? String(role).toLowerCase() : null;
}

export function isAuthed() {
  return !!getToken();
}

export async function refreshAccessToken(refreshTokenOverride) {
  const refreshToken = String(refreshTokenOverride ?? getRefreshToken() ?? "").trim();
  if (!refreshToken) throw new Error("Missing refreshToken");

  const { data } = await api.post("/authentication_/Refresh", {
    refreshToken,
  });

  if (data?.token) setToken(data.token);

  if (data?.refreshToken) setRefreshToken(data.refreshToken);
  if (data?.refreshTokenExpires) localStorage.setItem(REFRESH_EXPIRES_KEY, data.refreshTokenExpires);

  if (data?.profile) setProfile(data.profile);
  if (data?.user) setProfile(data.user);

  return data;
}

export async function login(student_id, password) {
  const { data } = await api.post("/authentication_/login", {
    student_id,
    password,
  });

  if (data?.token) setToken(data.token);
  if (data?.profile) setProfile(data.profile);
  if (data?.user) setProfile(data.user);

  if (data?.refreshToken) setRefreshToken(data.refreshToken);
  if (data?.refreshTokenExpires) localStorage.setItem(REFRESH_EXPIRES_KEY, data.refreshTokenExpires);

  if (data?.refreshToken) {
    try {
      await refreshAccessToken(data.refreshToken);
    } catch (e) {
      console.warn("Refresh after login failed:", e?.response?.data || e?.message || e);
    }
  }

  return data;
}