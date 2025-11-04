import { useAuthStore } from "@/stores/useAuthStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


function handleApiError(endpoint: string, res: Response, body: any) {
  const error: any = new Error(body?.message  || body?.error|| res.statusText || "API error");
  error.statusCode = res.status;
  error.statusText = res.statusText;
  error.raw = body;
  console.error(`❌ API error at ${endpoint}:`, {
    status: res.status,
    statusText: res.statusText,
    body,
  });
  return error;
}


export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      credentials: "include", // Include cookies (e.g., tokens)
    });

    let responseBody: any = null;
    try {
      responseBody = await res.json();
    } catch {
      responseBody = null;
    }

    if (!res.ok) throw handleApiError(endpoint, res, responseBody);

    return responseBody as T;
  } catch (e: any) {
    console.error(`apiFetch failed at ${endpoint}:`, e);
    throw e;
  }
}


export async function apiPost<T>(endpoint: string, body: any): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    let responseBody: any = null;
    try {
      responseBody = await res.json();
    } catch {
      throw new Error(`Unexpected response format from ${endpoint}`);
    }

    if (!res.ok) throw handleApiError(endpoint, res, responseBody);

    return responseBody as T;
  } catch (e: any) {
    console.error(`apiPost failed at ${endpoint}:`, e);
    throw e;
  }
}


export async function apiPut<T>(endpoint: string, body: any): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    let responseBody: any = null;
    try {
      responseBody = await res.json();
    } catch {
      throw new Error(`Unexpected response format from ${endpoint}`);
    }

    if (!res.ok) throw handleApiError(endpoint, res, responseBody);

    return responseBody as T;
  } catch (e: any) {
    console.error(`apiPut failed at ${endpoint}:`, e);
    throw e;
  }
}


export async function apiUpload(formData: FormData): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/uploads/profile-images`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      throw new Error("Unexpected response format from upload endpoint");
    }

    if (!res.ok) throw handleApiError("/uploads/profile-images", res, data);

    return data.url;
  } catch (e: any) {
    console.error("apiUpload failed:", e);
    throw e;
  }
}


export async function apiLogout() {
  try {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      console.warn("Logout request failed:", res.statusText);
    }
  } catch (e) {
    console.error("apiLogout error:", e);
  } finally {
    useAuthStore.getState().clearUser();
  }
}
