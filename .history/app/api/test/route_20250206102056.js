import { NextResponse } from "next/server";
import { axios } from "axios";

export async function GET() {
  const instance = axios.create({
    baseURL: "http://localhost:8000",
    
  })

  return NextResponse.json({ laravel: "Hello World" });
}