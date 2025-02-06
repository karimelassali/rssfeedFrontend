import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const { id } = request.nextUrl.searchParams;

  // Fetch data from the API
  const response = await axios.get(`http://127.0.0.1:8000/api/data/${id}`);
  const data = response.data;

  return NextResponse.json(data);
}
