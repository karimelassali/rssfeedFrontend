
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { articleTitle,articleDescription } = await req.json();

  try {
    GEMINI_API_KEY="AIzaSyCuzOdhYrPyiZzLK7kKbz3xnt4oUK3jz8o"
    adminPrompt = 'ALways summurize this feed descreption in 5-9 lines and extract its location.here its the prompt:';
    const response = axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
      prompt: adminPrompt,
    })
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error generating AI response:', error);
  }

}