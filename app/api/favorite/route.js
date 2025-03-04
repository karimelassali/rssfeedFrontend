import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  // Retrieve user data from cookies
  const userCookie = request.cookies.get("user")?.value;

  if (!userCookie) {
    return NextResponse.json({
      success: false,
      message: "User not found in cookies",
    }, { status: 401 });
  }

  try {
    // Parse the user data from the cookie
    const user = JSON.parse(userCookie);
    
    // Parse the request body
    const { source } = await request.json();

    if (!source) {
      return NextResponse.json({
        success: false,
        message: "Source is required",
      }, { status: 400 });
    }

    const req = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/favorite_sources/store/`, 
      {
        source: source,
        user_id: user.id
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  
    return NextResponse.json({
      success: true,
      message: req.data.message,
    });
  
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({
      success: false,
      message: "An error occurred while adding the source.",
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}