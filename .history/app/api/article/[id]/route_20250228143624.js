import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request, { params }) {
  const { id } = params;
  console.log('Extracted dynamic id:', id);

  const response = await axios.get(process.env.NEXT_PUBLICAPI_URL + `api/data/${id}`);
  return NextResponse.json(response.data);
}


