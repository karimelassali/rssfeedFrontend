import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const response = await axios.get("http://localhost:8000/api/test");
  const data = response.data;

  return NextResponse.json(data);
}
