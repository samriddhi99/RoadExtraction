#send requests to the/ backend
#send notifications to the frontend from model

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
user_bp = Blueprint('user', __name__)
print("user_dashboard_routes.py loaded!")
# Assuming you have this function defined somewhere
from services.user_service import register_request  
from services.user_service import get_notifications
# At top with imports

@user_bp.route('/request-access', methods=['POST', 'OPTIONS'])
@cross_origin()
def request_access():
    print("[+] Request route hit")
    if request.method == "OPTIONS":
        return '', 200
    try:
        print("[+] Request route hit")
        data = request.get_json()
        print("[+] Request data:", data)
        register_request(data)

        return jsonify({'message': 'Request submitted successfully'}), 200

    except Exception as e:
        print("Error handling request:", e)
        return jsonify({'error': 'Internal server error'}), 500

@user_bp.route('/notifications', methods=['GET'])
@cross_origin()
def fetch_notifications():
    try:
        notifications = get_notifications()  # returns a list of dicts
        return jsonify(notifications), 200
    except Exception as e:
        print("Error fetching notifications:", e)
        return jsonify({'error': 'Internal server error'}), 500