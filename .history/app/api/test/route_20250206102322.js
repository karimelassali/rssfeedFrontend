import { NextResponse } from "next/server";
import { axios } from "axios";
import axios from '../lib/axios';

export async function GET() {

  

  return NextResponse.json({ laravel: "Hello World" });
}