import fitz  # PyMuPDF
import os
import logging

def perform_ocr(filename: str) -> str:
    input_path = os.path.join('backend', 'uploads', filename)
    logging.debug(f"Input path: {input_path}")

    try:
        document = fitz.open(input_path)
        text = ''
        for page_num in range(len(document)):
            page = document.load_page(page_num)
            text += page.get_text()

        document.close()

        # Devolvemos el texto extraído en lugar de crear un archivo
        return text

    except Exception as e:
        logging.error(f"Error performing OCR: {e}")
        raise
