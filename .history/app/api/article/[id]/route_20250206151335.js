/*************  ✨ Codeium Command 🌟  *************/
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const { id } = request.nextUrl.searchParams;
export async function GET(req) {
  const { id } = req.params;

  // Fetch data from the API
  const response = await axios.get(`http://127.0.0.1:8000/api/data/${id}`);
  const data = response.data;

  return NextResponse.json(data);
}
/******  e77ffa60-21cb-43d8-904d-58fa2af4547d  *******/