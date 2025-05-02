from flask import Flask
from flask_cors import CORS
from app.api.admin_dashboard_routes import admin_bp
from app.api.auth_routes import auth_bp
from app.api.user_dashboard_routes import user_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # change this in production

# Enable CORS for frontend (adjust if needed)
CORS(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(user_bp, url_prefix='/api/user')

if __name__ == '__main__':
    app.run(debug=True)
