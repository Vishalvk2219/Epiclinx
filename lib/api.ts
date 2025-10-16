import { useAuthStore } from "@/stores/useAuthStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      credentials: "include", // Send cookies including HttpOnly refresh/access tokens
    });

    if (!res.ok) {
      const errorBody = await res.json();
      const error = new Error(errorBody.message || "API error");
      // Attach extra fields to the error object
      (error as any).statusCode = errorBody.statusCode;
      (error as any).raw = errorBody.raw;
      (error as any).error = errorBody.error;
      throw error;
    }

    return res.json();
  } catch (e: any) {
    throw new Error(e?.message || "API error");
  }
}

export async function apiPost<T>(endpoint: string, body: any): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    let responseBody: any = null;

    try {
      responseBody = await res.json();
    } catch (err) {
      throw new Error(`Unexpected error format from ${endpoint}`);
    }

    // if (!res.ok) {

    //   console.log(res)

    //   // Construct a custom error with extra details
    //   const error: any = new Error(responseBody.message || "API error");
    //   error.statusCode = responseBody.statusCode || res.status;
    //   error.statusText = responseBody.error || res.statusText;
    //   error.raw = responseBody;
    //   console.log("responseBody~~", responseBody)
    //   throw error;
    // }

    /*
    error: "Conflict"
    message: "Subscription already created"
    statusCode: 409
    */
    return responseBody.data;
  } catch (e: any) {
    throw new Error(e?.message || "API error");
  }
}

export async function apiUpload(formData: FormData): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/uploads/profile-images`, {
      method: "POST",
      body: formData,
      credentials: "include", // In case backend validates session
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Upload failed");
    }

      const data = await res.json();
      return data.data.url;
  } catch (e: any) {
    throw new Error(e?.message || "API error");
  }
}

export async function apiLogout() {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  useAuthStore.getState().clearUser();
}
