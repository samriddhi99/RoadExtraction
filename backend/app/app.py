from flask import Flask
from flask_cors import CORS

# Import your route blueprints
from api.auth_routes import auth_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # enable CORS for frontend requests

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
