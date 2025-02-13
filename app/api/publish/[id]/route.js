import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request, { params }) {
    const { id } = params;
  
    try {
      const response = await axios.post(process.env.API_URL+`api/article/publish/${id}`);
      const data = response.data;
      return NextResponse.json(data);
    } catch (error) {
      console.error("Error fetching article:", error.response?.data || error.message);
      return NextResponse.json({ error: error.response?.data || "Internal Server Error" }, { status: 500 });
    }
  }
  