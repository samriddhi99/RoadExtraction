from functools import wraps
from flask import request, jsonify

# This simulates getting the user role — you'd replace this with real auth logic
def get_current_user_role():
    # For now, get it from headers (e.g., frontend sets role in headers during dev)
    return request.headers.get("Role", "").lower()

def role_required(required_roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            role = get_current_user_role()
            if role not in required_roles:
                return jsonify({'error': 'Access forbidden: insufficient permissions'}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator
