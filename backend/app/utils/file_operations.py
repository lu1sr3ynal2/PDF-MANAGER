import os
from fastapi import HTTPException

def save_file(file, upload_dir):
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    return file_path

def delete_file(filename, upload_dir):
    file_path = os.path.join(upload_dir, filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="El archivo no existe")
    os.remove(file_path)

def rename_file(filename, new_name, upload_dir):
    current_path = os.path.normpath(os.path.join(upload_dir, filename))
    new_path = os.path.normpath(os.path.join(upload_dir, new_name))

    # Verificar si el archivo actual existe
    if not os.path.isfile(current_path):
        raise HTTPException(status_code=404, detail="El archivo no existe")

    # Verificar si el nuevo archivo ya existe
    if os.path.isfile(new_path):
        raise HTTPException(status_code=400, detail="El nuevo nombre de archivo ya existe")

    # Intentar renombrar el archivo
    os.rename(current_path, new_path)
