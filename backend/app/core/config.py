import os

UPLOAD_DIR = "backend/uploads"

# Crear el directorio de uploads si no existe
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
