from flask import Blueprint, request, jsonify
from . import get_access_requests, get_user_access_data, update_request_status, grant_access_to_user


admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/admin/access-requests", methods=["GET"])
def list_requests():
    requests = get_access_requests()
    return jsonify(requests), 200

@admin_bp.route("/admin/user-access", methods=["GET"])
def list_user_access():
    access_data = get_user_access_data()
    return jsonify(access_data), 200

@admin_bp.route("/admin/approve/<request_id>", methods=["POST"])
def approve_request(request_id):
    success = grant_access_to_user(request_id)
    if success:
        return jsonify({"message": "Request approved"}), 200
    return jsonify({"error": "Approval failed"}), 400

@admin_bp.route("/admin/reject/<request_id>", methods=["POST"])
def reject_request(request_id):
    success = update_request_status(request_id, "rejected")
    if success:
        return jsonify({"message": "Request rejected"}), 200
    return jsonify({"error": "Rejection failed"}), 400
