from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    # Do validation, save user, hash password
    return jsonify({'message': 'User signed up successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    # Authenticate, generate token/session
    return jsonify({'message': 'Login successful', 'role': 'user'}), 200
