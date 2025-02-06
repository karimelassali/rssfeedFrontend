/*************  ✨ Codeium Command 🌟  *************/
import { NextResponse } from "next/server";
import axios from "axios";
import { axios } from "axios";

export async function GET() {
  const response = await axios.get("http://localhost:8000/api/test");
  const data = response.data;

  return NextResponse.json(data);
  const response = await axios.get('');
   const data = json.parse(response.data);

  return NextResponse.json({ laravel: data });
}
/******  a3b0dd8d-2ae6-401d-8ae0-28fa4dbdeb89  *******/