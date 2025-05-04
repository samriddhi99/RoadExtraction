from flask import Blueprint, request, jsonify
from services.auth_service import create_user, login_user, login_admin
auth_bp = Blueprint('auth', __name__)


# In routes/signup.py or whatever route you're using
from flask import request, jsonify
from services.auth_service import create_user

@auth_bp.route('/signup', methods=['POST'])
def signup():
    print("[+] Signup route hit")
    data = request.form
    try:
        create_user(data)  # this function will handle everything except file stuff
        return jsonify({"message": "User created successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        login_user(data)  # this function will handle everything except file stuff
        return jsonify({"message": "User created successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({'message': 'Login successful', 'role': 'user'}), 200
