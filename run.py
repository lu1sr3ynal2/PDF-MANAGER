# run.py

if __name__ == "__main__":
    import sys
    import uvicorn

    # Añade el directorio 'backend' al sys.path para que Python pueda encontrar el módulo 'app'
    sys.path.append("backend")

    # Ejecuta el servidor Uvicorn con la aplicación de FastAPI
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
