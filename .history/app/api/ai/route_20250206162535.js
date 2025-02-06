import { NextResponse } from 'next/server';

export async function POST(req) {
  const { articleTitle, articleDescription } = await req.json();

  try {
    const GEMINI_API_KEY = 'AIzaSyCuzOdhYrPyiZzLK7kKbz3xnt4oUK3jz8o';

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY environment variable is not set" }, { status: 500 });
    }

    const prompt = `Always summarize this feed description in 5-9 lines and extract its location. Return JSON with title and description. Here is the prompt:\n\nTitle: ${articleTitle}\nDescription: ${articleDescription}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json(); // Try to get error details from the API
      console.error("API Error:", errorData);
      return NextResponse.json({ error: errorData.error.message || 'API request failed', status: response.status }, { status: response.status }); // Include status and error message
    }


    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Fetch Error:', error);
      return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}