import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request, { params }) {
  const { id } = params;
  console.log('Extracted dynamic id:', id);

  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + `api/data/${id}`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${request.cookies.get('authToken')?.value}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Unable to fetch data' + error }, { status: 500 });
  }
}
