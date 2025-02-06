import { NextResponse } from "next/server";
import { axios } from "axios";

export async function GET() {
  const instance = axios.cr

  return NextResponse.json({ laravel: "Hello World" });
}