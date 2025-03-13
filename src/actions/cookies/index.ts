"use server";

import { cookies } from "next/headers";

// Set a cookie
export async function setCookie(
  name: string,
  value: string,
  options: { expires?: Date; path?: string } = {},
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(name, value, options);
}

// Get a cookie
export async function getCookie(name: string): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value ?? null;
}

// Delete a cookie
export async function deleteCookie(name: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(name, "", { expires: new Date(0) });
}
