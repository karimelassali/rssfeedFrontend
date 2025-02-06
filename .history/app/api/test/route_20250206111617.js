/*************  ✨ Codeium Command 🌟  *************/
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const cache = await caches.open("my-cache");
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

export async function GET() {
  const response = await axios.get("http://127.0.0.1:8000/api/data");
  const data = response.data;

  const newResponse = new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });

  await cache.put(request, newResponse);

  return newResponse;
  return NextResponse.json(data);
}

/******  7a62bca8-5244-4dff-8539-d648fd68c50b  *******/