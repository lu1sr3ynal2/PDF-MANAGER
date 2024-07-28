from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import logging
import os

from app.api.endpoints import router
from app.core.config import UPLOAD_DIR

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

app.mount("/static", StaticFiles(directory="frontend/build/static"), name="static")

@app.get("/{path:path}")
async def serve_react_app(path: str):
    if path.startswith('api/'):
        raise HTTPException(status_code=404, detail="Endpoint de la API no encontrado")
    file_path = os.path.join("frontend/build", path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse("frontend/build/index.html")
