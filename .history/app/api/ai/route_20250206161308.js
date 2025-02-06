import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { articleTitle, articleDescription } = await req.json();

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Use environment variable for API key
    const adminPrompt = 'Always summarize this feed description in 5-9 lines and extract its location. Here is the prompt:';
    
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      prompt: adminPrompt,
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error generating AI response:', error);
    return NextResponse.error();
  }
}