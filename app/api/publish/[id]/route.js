import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request, { params }) {
    const { id } = params;
    const {title , descreption , image,category,showInHomePage, publishType,date,time,scheduledTime} = await request.json();
    console.log(title, descreption,image,category,showInHomePage, publishType,date,time,scheduledTime);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/article/${id}/publish`,{
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${request.cookies.get('authToken')?.value}`,
        },
        title, description:descreption,image,category,showInHomePage, publishType,date,time,scheduledTime
      });
      const data = response.data;
      return NextResponse.json(data);
    } catch (error) {
      console.error("Error fetching article:", error.response?.data || error.message);
      return NextResponse.json({ error: error.response?.data || "Internal Server Error" }, { status: 500 });
    }
  }
  