export async function onRequest(context) {
  const request = context.request, url = new URL(request.url)
  if (!url.searchParams.has('host')) {
    return new Response(JSON.stringify({
      code: 400,
      message: 'host param is required',
    }), {
      status: 400,
      statusText: 'Bad Request',
    })
  }

  const host = url.searchParams.get('host'), protocol = url.searchParams.get('ssl') || '1'
  const proxyUrl = `${protocol === '1' ? 'https' : 'http'}://${host}`
  console.log(proxyUrl)
  const response = await fetch(proxyUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/html; charset=gb2312',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    },
  })
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
  })
}
