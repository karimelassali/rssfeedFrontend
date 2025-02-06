import { NextResponse } from "next/server";

export async function GET() {

  
  return NextResponse.json({ laravel: "Hello World" });
}