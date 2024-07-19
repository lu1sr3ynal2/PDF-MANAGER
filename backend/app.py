from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from routes.files import bp as files_bp
import os

def create_app():
    app = Flask(__name__, static_folder='../frontend/build')
    CORS(app)

    # Registra las rutas
    app.register_blueprint(files_bp)

    # Ruta principal para servir la aplicación React
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path.startswith('api/'):
            return jsonify({"message": "Invalid API endpoint"}), 404
        elif path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    # Manejar errores 404 y devolver index.html para rutas desconocidas (React Router)
    @app.errorhandler(404)
    def not_found(e):
        if request.path.startswith('/api/'):
            return jsonify({"message": "API endpoint not found"}), 404
        return send_from_directory(app.static_folder, 'index.html')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
