from flask import Blueprint, request, send_file, jsonify
from io import BytesIO
import fitz  # PyMuPDF
import os

bp = Blueprint('files', __name__)

@bp.route('/api/files')
def get_files():
    files = os.listdir('uploads')
    return jsonify(files)

@bp.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400

    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400

    if file and file.filename.endswith('.pdf'):
        if not os.path.exists('uploads'):
            os.makedirs('uploads')
        file.save(os.path.join('uploads', file.filename))
        return jsonify(message='File uploaded successfully'), 200
    else:
        return 'Invalid file format. Please upload a PDF file.', 400

@bp.route('/api/ocr/<filename>')
def ocr_file(filename):
    try:
        # Extrae el texto del archivo PDF
        text = perform_ocr(filename)
        
        # Crea un archivo en memoria
        file_stream = BytesIO()
        file_stream.write(text.encode('utf-8'))
        file_stream.seek(0)  # Regresa al inicio del archivo en memoria
        
        # Envía el archivo al cliente
        return send_file(
            file_stream,
            as_attachment=True,
            download_name=f'{filename}.txt',
            mimetype='text/plain'
        )
    except Exception as e:
        return jsonify(error=str(e)), 500

def perform_ocr(filename):
    doc = fitz.open(os.path.join('uploads', filename))
    text = ""
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text += page.get_text("text")
    return text

@bp.route('/api/delete/<filename>', methods=['DELETE'])
def delete_pdf(filename):
    try:
        os.remove(os.path.join('uploads', filename))
        return '', 200
    except OSError:
        return 'Error deleting the file.', 500

@bp.route('/api/rename/<filename>', methods=['PUT'])
def rename_file(filename):
    try:
        new_filename = request.json.get('newName')
        if not new_filename:
            return jsonify(error='New file name not provided'), 400

        current_path = os.path.join('uploads', filename)
        if not os.path.isfile(current_path):
            print(f"File not found: {current_path}")  # Depuración
            return jsonify(error='File does not exist'), 404

        new_path = os.path.join('uploads', new_filename)
        os.rename(current_path, new_path)

        return jsonify(message=f'File renamed to {new_filename}'), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

