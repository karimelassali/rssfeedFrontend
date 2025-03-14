import { NextResponse } from 'next/server';
import axios from 'axios';

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { source_id } = body;

    // Make request to Laravel backend
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}api/favorite-sources/${source_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers if needed
        }
      }
    );

    return NextResponse.json(response.data);

  } catch (error) {
    console.error('Error deleting favorite source:', error);
    return NextResponse.json(
      { 
        message: error.response?.data?.message || 'Failed to delete favorite source'
      },
      { status: error.response?.status || 500 }
    );
  }
}