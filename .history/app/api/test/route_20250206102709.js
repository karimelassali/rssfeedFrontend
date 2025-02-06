import { NextResponse } from "next/server";
import { axios } from "axios";

export async function GET() {

  const response = await axios.get('');
   const data = json.parse(response.data);

  return NextResponse.json({ laravel: data });
}