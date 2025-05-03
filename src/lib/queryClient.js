// lib/queryClient.js

import { QueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.DEV
  ? "http://localhost:3000"
  : window.location.origin;

async function throwIfResNotOk(res) {
  if (!res.ok) {
    // try JSON first, fallback to text
    let errText;
    try {
      const errJson = await res.json();
      errText = errJson.error || JSON.stringify(errJson);
    } catch {
      errText = await res.text();
    }
    throw new Error(`${res.status}: ${errText || res.statusText}`);
  }
  return res;
}

/**
 * Fetch + JSON wrapper that:
 *  - prefixes BASE
 *  - sends Authorization: Bearer <token> from localStorage
 *  - stringifies body once
 *  - includes cookies if you need them
 */
export async function apiRequest(path, opts = {}) {
  const { method = "GET", body, headers: customHeaders = {} } = opts;

  // Build headers, injecting JSON content-type if needed
  const headers = { ...customHeaders };
  if (body != null && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Pull token from localStorage (or wherever you store it)
  const token = localStorage.getItem("token");
  console.log("My localStorage token:", token);

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(BASE + path, {
    method,
    headers,
    // only JSON-stringify once, here
    body: body != null ? JSON.stringify(body) : undefined,
    credentials: "include", 
  });

  await throwIfResNotOk(res);

  // Return parsed JSON (or empty object)
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export const getQueryFn = ({ on401 }) => {
  return async ({ queryKey }) => {
    try {
      return await apiRequest(queryKey[0]);
    } catch (err) {
      if (on401 === "returnNull" && err.message.startsWith("401")) {
        return null;
      }
      throw err;
    }
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      staleTime: Infinity,
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
});
