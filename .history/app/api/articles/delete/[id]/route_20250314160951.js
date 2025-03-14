import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Get auth token from cookie
    const authToken = request.cookies.get('authToken')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Send delete request to Laravel backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/articles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete article');
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}