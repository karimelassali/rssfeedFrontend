import { NextResponse } from "next/server";
import axios from "axios";

export async function PUT(request) {
  try {
    const authToken = request.cookies.get("authToken")?.value;
    if (!authToken) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { api_key } = body;

    if (!api_key) {
      return NextResponse.json({ message: "API key is required" }, { status: 400 });
    }

    const baseUrl = 'localhost:3000/;
    const url = `${baseUrl}/api/settings/setApiKey/`;
    console.log("Requesting URL:", url); // Debug the URL

    const response = await axios.put(
      url,
      { api_key },
      {
        headers: { Authorization: `Bearer ${authToken}` },
        timeout: 5000, // Fail after 5 seconds
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