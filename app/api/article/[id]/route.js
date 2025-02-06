import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request, { params }) {
  const { id } = params;
  console.log('Extracted dynamic id:', id);

  const response = await axios.get(`http://127.0.0.1:8000/api/data/${id}`);
  return NextResponse.json(response.data);
}


