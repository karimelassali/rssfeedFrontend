import { NextResponse } from "next/server";
import { axios } from "axios";
import axios from '../lib/axios';

export async function GET() {

  const response = await axios.get('');
  

  return NextResponse.json({ laravel: "Hello World" });
}