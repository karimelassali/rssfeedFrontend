/*************  ✨ Codeium Command 🌟  *************/
import { NextResponse } from "next/server";
import axios from "axios";
import NodeCache from "node-cache";

// Create a cache instance with a TTL of 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600 });

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const cacheKey = `apiData_${id}`;
export async function GET() {
  const cacheKey = "apiData";
  // const cachedData = cache.get(cacheKey);

  const cachedData = cache.get(cacheKey);
  // if (cachedData) {
  //   // Return cached data if available
  //   return NextResponse.json(cachedData);
  // }

  if (cachedData) {
    // Return cached data if available
    return NextResponse.json(cachedData);
  }
  // Fetch data from the API if not cached
  const response = await axios.get("http://127.0.0.1:8000/api/data/" + 3);
  const data = response.data;

  // Fetch data from the API if not cached
  const response = await axios.get(`http://127.0.0.1:8000/api/data/${id}`);
  const data = response.data;
  // Store the fetched data in the cache
  // cache.set(cacheKey, data);

  // Store the fetched data in the cache
  cache.set(cacheKey, data);

  return NextResponse.json(data);
}
} 
/******  fa6c6253-b03b-432d-b601-db87705d37cb  *******/