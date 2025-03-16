/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/api/auth/cookies/route.ts
import { NextResponse } from "next/server";
import { deleteCookie, setCookie, getCookie } from "~/actions/cookies";
import { z } from "zod";

// Define a schema for validating the request body for POST
const cookieSchema = z.object({
  action: z.enum(["set", "delete"]),
  name: z.string().min(1, "Cookie name is required"),
  value: z.string().optional(), // Value is required only for "set" action
  options: z
    .object({
      expires: z.date().optional(),
      path: z.string().optional(),
    })
    .optional(),
});

// Define a schema for validating the query parameters for GET
const getCookieSchema = z.object({
  name: z.string().min(1, "Cookie name is required"),
});

export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validation = cookieSchema.safeParse(body);

    // If validation fails, return a 400 error
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { action, name, value, options } = validation.data;

    // Additional validation for "set" action
    if (action === "set" && !value) {
      return NextResponse.json(
        { error: "Value is required for 'set' action" },
        { status: 400 },
      );
    }

    // Perform the cookie operation
    if (action === "set") {
      await setCookie(name, value!, options);
    } else if (action === "delete") {
      await deleteCookie(name);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to manipulate cookie:", error);
    return NextResponse.json(
      { error: "Failed to manipulate cookie" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    // Parse and validate the query parameters
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    const validation = getCookieSchema.safeParse({ name });

    // If validation fails, return a 400 error
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 },
      );
    }

    // Get the cookie value
    const value = await getCookie(validation.data.name);

    return NextResponse.json({ value });
  } catch (error) {
    console.error("Failed to retrieve cookie:", error);
    return NextResponse.json(
      { error: "Failed to retrieve cookie" },
      { status: 500 },
    );
  }
}
