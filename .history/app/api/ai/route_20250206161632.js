import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { articleTitle, articleDescription } = await req.json();

  try {
    console.log("Request Body:", JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }, null, 2)); // Log the request body
  
    const response = await axios.post(
      `...`, // Your URL
      { contents: [{ parts: [{ text: prompt }] }] },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  
    console.log("Response Data:", response.data); // Log the response data
    return NextResponse.json(response.data);
  
  } catch (error) {
      console.error('Full Error:', error); // Log the entire error object
      if (axios.isAxiosError(error)) {
          console.error("Axios Error Details:", error.response?.data); // Log Axios error details
          return NextResponse.json({ error: error.message, status: error.response?.status || 500 }, { status: error.response?.status || 500 });
      } else {
          return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
      }
  }
}