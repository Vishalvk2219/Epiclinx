// lib/api-server.ts
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetchServer(endpoint: string, options?: RequestInit) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Unauthorized");

  const data = await res.json();
  return data.user
}
