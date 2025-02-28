import { NextResponse } from "next/server";
import axios from "axios";
import NodeCache from "node-cache";

// Create a cache instance with a TTL of 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600 });

export async function GET(request,{params}) {
  
  const cacheKey = "apiData";
  // const cachedData = cache.get(cacheKey);

  // if (cachedData) {
  //   // Return cached data if available
  //   return NextResponse.json(cachedData);
  // }

  // Fetch data from the API if not cached
  const response = await axios.get(process.env.API_URL + `api/data?page=3 `);
  const data = response.data;

  // Store the fetched data in the cache
  // cache.set(cacheKey, data);

  return NextResponse.json(data);
}