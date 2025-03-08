import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request, { params }) {

  const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + `api/publishedArticles`);
  return NextResponse.json(response.data);
}


