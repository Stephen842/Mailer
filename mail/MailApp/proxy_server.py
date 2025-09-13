from fastapi import FastAPI, Request, Response
import httpx

app = FastAPI()

TARGET_BASE = 'https://testapi.opaycheckout.com'

@app.api_route('/{full_path:path}', methods=['GET', 'POST','PUT', 'DELETE', 'PATCH'])
async def proxy(request: Request, full_path: str):
    # Target API base
    target_url = f'{TARGET_BASE}/{full_path}'

    # Forward headers
    headers = {k: v for k, v in request.headers.items()
               if k.lower() not in ["host", "content-length"]}

    # Forward body
    body = await request.body()

    async with httpx.AsyncClient() as client:
        resp = await client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=body,
            timeout=60
        )

    return Response(
        content=resp.content,
        status_code=resp.status_code,
        headers=dict(resp.headers),
        media_type=resp.headers.get("content-type")
    )