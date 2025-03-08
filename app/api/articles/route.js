import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  // Get all search params from the request URL
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || 1;
  const pageSize = searchParams.get('pageSize') || 10;
  const search = searchParams.get('search') || null;
  const activeFilters = searchParams.get('activeFilters') || null;
  const _t = searchParams.get('_t') || Date.now(); // Cache-busting param

  // Construct the backend URL with all query parameters
  const backendUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}api/data`); // Use non-public env var
  backendUrl.searchParams.append('page', page);
  backendUrl.searchParams.append('pageSize', pageSize);
  if (search) backendUrl.searchParams.append('search', search);
  if (activeFilters) backendUrl.searchParams.append('activeFilters', activeFilters);
  backendUrl.searchParams.append('_t', _t);

  console.log("Backend request URL from API route:", backendUrl.toString());

  try {
    const response = await axios.get(backendUrl.toString(), {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${request.cookies.get('authToken')?.value}`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    return NextResponse.json(response.data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error("Error fetching data from backend:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching data", error: error.message },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};