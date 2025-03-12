import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Cookise from "cookies";

export async function PUT(request) {
  try {
    const cookieStore = cookies();
    const authToken = request.cookies.get("authToken")?.value;

    if (!authToken) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { api_key } = body;

    if (!api_key) {
      return NextResponse.json(
        { message: "API key is required" },
        { status: 400 }
      );
    }

    // Here you would typically update the API key in your database
    // For example:
    // await db.user.update({
    //   where: { id: userId },
    //   data: { apiKey: api_key }
    // });

    return NextResponse.json(
      { message: "API key updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating API key:", error);
    return NextResponse.json(
      { message: "Failed to update API key" },
      { status: 500 }
    );
  }
}