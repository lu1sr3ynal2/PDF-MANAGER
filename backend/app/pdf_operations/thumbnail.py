# app/pdf_operations/thumbnail.py

import os
import io
from PIL import Image
import fitz  # PyMuPDF
from fastapi import HTTPException
import logging
from app.core.config import UPLOAD_DIR

def generate_thumbnail(filename):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    doc = fitz.open(file_path)
    page = doc.load_page(0)
    pix = page.get_pixmap()
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    return buffer

def get_pdf_metadata(filename):
    try:
        file_path = os.path.join(UPLOAD_DIR, filename)
        if not os.path.isfile(file_path):
            raise HTTPException(status_code=404, detail="Archivo no encontrado")

        doc = fitz.open(file_path)
        num_pages = doc.page_count
        file_size = os.path.getsize(file_path)

        return {
            "num_pages": num_pages,
            "file_size": file_size
        }
    except Exception as e:
        logging.error(f"Error getting PDF metadata: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo los metadatos del PDF")
