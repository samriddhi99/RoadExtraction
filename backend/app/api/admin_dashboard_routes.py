from flask import Blueprint, request, jsonify
from services.admin_service  import get_access_requests, get_user_access_data, update_request_status, grant_access_to_user


admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/access-requests", methods=["GET"])
def list_requests():
    print("[+] Access requests route hit")
    requests = get_access_requests()
    access_data = get_user_access_data()

    j = jsonify({"accessRequests":requests, "userAccesses":access_data})
    print(j)
    return j, 200



@admin_bp.route("/approve/<request_id>", methods=["POST"])
def approve_request(request_id):
    success = grant_access_to_user(request_id)
    if success:
        return jsonify({"message": "Request approved"}), 200
    return jsonify({"error": "Approval failed"}), 400

@admin_bp.route("/reject/<request_id>", methods=["POST"])
def reject_request(request_id):
    success = update_request_status(request_id, "rejected")
    if success:
        return jsonify({"message": "Request rejected"}), 200
    return jsonify({"error": "Rejection failed"}), 400
