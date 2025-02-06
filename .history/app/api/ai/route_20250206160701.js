import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { articleTitle,articleDescription } = await req.json();

  try {
    adminPrompt = 'ALways summurize this feed descreption in 5-9 lines and extract its location.here its the prompt:';

    
  } catch (error) {
    console.error('Error generating AI response:', error);
  }

}