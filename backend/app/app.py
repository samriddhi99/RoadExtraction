from flask import Flask
from flask_cors import CORS

# Import your route blueprints
from api.auth_routes import auth_bp
from api.user_dashboard_routes import user_bp
from api.admin_dashboard_routes import admin_bp  

def create_app():
    app = Flask(__name__)
 

    CORS(app,supports_credentials=True)
 # enable CORS for frontend requests

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/user")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    print("ALL FLASK ROUTES:")
    for rule in app.url_map.iter_rules():
        print(rule)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
