# user_service.py

from models.user import User
from models.location import Location
from models.permission_request import PermissionRequest
from models.notification import Notification
from utils.nlp import process_query  # We'll pretend this exists

from sqlalchemy.orm import Session

# All functions will take in a db session now

def get_accessible_locations(db: Session, user_id: str):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        return []
    return user.accessible_locations  # Assuming a relationship exists

def request_permission(db: Session, user_id: str, request_data: dict):
    permission = PermissionRequest(
        user_id=user_id,
        area=request_data.get("area"),
        reason=request_data.get("reason"),
        status="pending"
    )
    db.add(permission)
    db.commit()
    db.refresh(permission)
    return {"message": "Permission request submitted", "request_id": permission.id}

def search_location(db: Session, user_id: str, query: str):
    # Pass query through NLP model to get interpreted result
    sql_query = process_query(query)
    
    # Execute the interpreted query manually
    result = db.execute(sql_query)
    return result.fetchall()

def get_notifications(db: Session, user_id: str):
    notifications = db.query(Notification).filter(Notification.user_id == user_id).all()
    notif_list = []
    for notif in notifications:
        notif_list.append({
            "change_detected": notif.change_detected,
            "metadata": notif.metadata,
            "image_url": notif.image_url
        })
    return notif_list
