export async function PUT(request, { params }) {

    const { api_key } = params;
    if(api_key){
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
    }else{
      return Response.json({ error: 'Invalid parameters' }, { status: 400 });
    }

  // return Response.json({ error: 'Invalid parameters' }, { status: 400 });

}