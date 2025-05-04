#send requests to the/ backend
#send notifications to the frontend from model

from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

# Assuming you have this function defined somewhere
from services.user_service import register_request  

@auth_bp.route('/api/request-access', methods=['POST'])
def request_access():
    try:
        data = request.get_json()

        required_fields = [
            "fullName", "email", "phoneNumber", "department", "designation",
            "locations", "justification", "duration", "supervisorInfo",
            "additionalComments", "termsAgreed", "confidentialityAgreed"
        ]

        # Basic validation to make sure nothing essential is missing
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

        # Call your backend function to handle this request
        register_request(data)

        return jsonify({'message': 'Request submitted successfully'}), 200

    except Exception as e:
        print("Error handling request:", e)
        return jsonify({'error': 'Internal server error'}), 500
