export async function Put(request,{params}){
  const {parametres} = params;

  if(parametres == 'api_key'){
    const {api_key} = params;
    axios.put(process.env.NEXT_PUBLIC_API_URL + `api/setApiKey`,{
      
      api_key:api_key
    })
  }
}