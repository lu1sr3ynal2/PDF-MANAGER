# app/api/endpoints/pdf.py (archivo principal)

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
import logging
import os
import io
from app.utils.file_operations import save_file, delete_file, rename_file
from app.pdf_operations.ocr import perform_ocr
from app.core.config import UPLOAD_DIR
from app.pdf_operations.thumbnail import generate_thumbnail, get_pdf_metadata
import fitz  # PyMuPDF

router = APIRouter()

class RenameRequest(BaseModel):
    new_name: str

@router.get("/api/files")
async def get_files():
    files_info = []
    for filename in os.listdir(UPLOAD_DIR):
        file_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.isfile(file_path) and filename.endswith('.pdf'):
            file_info = {
                "name": filename,
                "size": os.path.getsize(file_path),
                "pages": get_pdf_page_count(file_path)
            }
            files_info.append(file_info)
    return files_info

def get_pdf_page_count(file_path):
    doc = fitz.open(file_path)
    return doc.page_count

@router.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    logging.debug(f"Received file: {file.filename}")
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Formato de archivo no válido. Por favor, sube un archivo PDF.")
    save_file(file, UPLOAD_DIR)
    return {"message": "Archivo subido exitosamente"}

@router.delete("/api/delete/{filename}")
async def delete_file_endpoint(filename: str):
    delete_file(filename, UPLOAD_DIR)
    return {"message": "Archivo eliminado exitosamente"}

@router.put("/api/rename/{filename}")
async def rename_file_endpoint(filename: str, rename_request: RenameRequest):
    current_path = os.path.normpath(os.path.join(UPLOAD_DIR, filename))
    new_path = os.path.normpath(os.path.join(UPLOAD_DIR, rename_request.new_name))

    if not os.path.isfile(current_path) and os.path.isfile(new_path):
        return {"message": f"El archivo ya ha sido renombrado a {rename_request.new_name}"}

    rename_file(filename, rename_request.new_name, UPLOAD_DIR)
    return {"message": f"Archivo renombrado a {rename_request.new_name}"}

@router.get("/api/ocr/{filename}")
async def ocr_file(filename: str):
    try:
        text = perform_ocr(filename)
        return {"message": "OCR realizado exitosamente", "content": text}
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.error(f"Error performing OCR: {e}")
        raise HTTPException(status_code=500, detail="Error realizando OCR")

@router.get("/api/thumbnail/{filename}")
async def get_thumbnail(filename: str):
    try:
        buffer = generate_thumbnail(filename)
        return StreamingResponse(buffer, media_type="image/png")
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.error(f"Error generating thumbnail: {e}")
        raise HTTPException(status_code=500, detail="Error generando la miniatura")

@router.get("/api/metadata/{filename}")
async def get_metadata(filename: str):
    return get_pdf_metadata(filename)
