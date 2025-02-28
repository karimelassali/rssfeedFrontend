import { NextResponse } from 'next/server';
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 10;
    const search = searchParams.get('search') || '';
    const activeFilters = searchParams.get('activeFilters') || [];

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feeds?page=${page}&pageSize=${pageSize}`, {
            headers: {
                'Accept': 'application/json',
                'host': 'localhost:8000'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return NextResponse.json({
            data: data.data,
            current_page: data.current_page,
            last_page: data.last_page
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 });
    }
}