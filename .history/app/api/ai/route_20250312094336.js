import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { articleTitle, articleDescription } = body;

    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set" },
        { status: 500 }
      );
    }

    const prompt = `Summarize this article in a professional and structured way in italian. Extract the location and provide a clean and concise title. Remove unnecessary labels like "Title:" or "Location:". Format the response as follows without any special characters or symbols:

    - Title: [Your extracted title]
    - Location: [Extracted location]
    - Summary: [A clear, well-structured summary of 5-9 lines]

    Title: ${articleTitle}
    Description: ${articleDescription}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ], q
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "API request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json(
        { error: "AI response is empty." },
        { status: 500 }
      );
    }

    // معالجة النص وتحسين التنسيق
    let cleanedText = generatedText
      .replace(/Title:\s*/i, "") // إزالة "Title:"
      .replace(/Location:\s*/i, "") // إزالة "Location:"
      .replace(/Description:\s*/i, "") // إزالة "Description:"
      .trim(); // إزالة أي فراغات زائدة

    // تقسيم النص إلى أقسام واضحة
    const lines = cleanedText.split("\n").filter(line => line.trim() !== ""); // إزالة الأسطر الفارغة
    const aiTitle = lines.shift(); // أول سطر هو العنوان
    const aiLocation = lines.shift(); // ثاني سطر هو الموقع
    const aiDescription = lines.join(" "); // باقي النص هو الوصف

    return NextResponse.json(
      {
        title: aiTitle,
        location: aiLocation,
        description: aiDescription,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." + error },
      { status: 500 }
    );
  }
}
