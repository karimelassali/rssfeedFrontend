import { NextResponse } from "next/server";
import { Axios } from "axios";

export async function GET() {


  return NextResponse.json({ laravel: "Hello World" });
}