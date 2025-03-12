export async function PUT(request, { params }) {
  const { parameter } = params;

  if (parameter === 'api_key') {
    const { api_key } = params;
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}api/setApiKey`, {
        api_key: api_key
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${request.cookies.get('authToken')?.value}`
        }
      });
      return Response.json(response.data);
    } catch (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: 'Invalid parameters' }, { status: 400 });

  }
}