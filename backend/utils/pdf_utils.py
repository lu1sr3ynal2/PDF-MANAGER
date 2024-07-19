import fitz  # PyMuPDF
import os

def edit_pdf(filename):
    input_path = os.path.join('uploads', filename)
    output_path = os.path.join('uploads', 'edited_' + filename)

    document = fitz.open(input_path)
    first_page = document.load_page(0)
    first_page.insert_text((100, 100), "B1N4R10!", fontsize=20, color=(0, 1, 0))

    document.save(output_path)
    document.close()

    return output_path

def perform_ocr(filename):
    input_path = os.path.join('uploads', filename)
    output_path = os.path.join('uploads', filename.replace('.pdf', '.txt'))

    document = fitz.open(input_path)
    text = ''
    for page_num in range(len(document)):
        page = document.load_page(page_num)
        text += page.get_text()

    document.close()

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(text)

    return output_path
