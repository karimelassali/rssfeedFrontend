import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

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

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/settings/setApiKey/`,
      { api_key },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );  

    return NextResponse.json(
      { message: response.data.message || "API key updated successfully" },
      { status: response.status }
    );
  } catch (error) {
    console.error("Error updating API key:", error);
    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to update API key" },
      { status: error.response?.status || 500 }
    );
  }
}