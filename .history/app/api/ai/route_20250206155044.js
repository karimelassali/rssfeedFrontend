import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { articleTitle } = await req.json();

  try {
    const response = await generateText({
      model: google('gemini-1.5-flash'),
      messages: [
        {
          role: 'user',
          content: `Calculate the matching percentage between my interests: ${myInterests}, age: ${meAge}, description: ${meDesc} and user interests: ${userInterests}, age: ${userAge}, description: ${userDesc}. Respond with just the percentage as a number between 0 and 100.`,
        },
      ],
      maxTokens: 3,
    });

    console.log('AI Response:', response);

    if (response) {
      const percentage = response.text;
        return NextResponse.json({ response: percentage });
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
  }

}