import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const response = await axios.get("http://1:8000/");
  const data = response.data;

  return NextResponse.json(data);
}
