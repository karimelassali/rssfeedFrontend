import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { articleTitle, articleDescription } = await req.json();

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY environment variable is not set" }, { status: 500 });
    }

    const prompt = `Always summarize this feed description in 5-9 lines and extract its location. Here is the prompt:\n\nTitle: ${articleTitle}\nDescription: ${articleDescription}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error generating AI response:', error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json({ error: error.message, status: error.response?.status || 500 }, { status: error.response?.status || 500 }); // More informative error
    } else {
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
  }
}