import { useEffect, useState } from "react";

const AUTH_STORAGE_KEY = "hirehub_auth";

function safeParse(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Unable to parse stored auth payload.", error);
    return null;
  }
}

export function getStoredAuth() {
  return safeParse(localStorage.getItem(AUTH_STORAGE_KEY));
}

export function getUser() {
  return getStoredAuth()?.user || null;
}

export function getToken() {
  return getStoredAuth()?.token || null;
}

export function saveAuthSession(accessToken, user) {
  const payload = { token: accessToken, user };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  localStorage.setItem("token", accessToken);
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event("auth-change"));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth-change"));
}

export function dashboardPathForRole(role) {
  if (role === "student") return "/student-dashboard";
  if (role === "company") return "/company-dashboard";
  if (role === "admin") return "/admin-dashboard";
  return "/";
}

export function useAuthState() {
  const [authState, setAuthState] = useState(getStoredAuth());

  useEffect(() => {
    const sync = () => setAuthState(getStoredAuth());
    window.addEventListener("storage", sync);
    window.addEventListener("auth-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-change", sync);
    };
  }, []);

  return {
    token: authState?.token || null,
    user: authState?.user || null,
    isAuthenticated: Boolean(authState?.token && authState?.user),
  };
}
