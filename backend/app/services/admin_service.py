from datetime import datetime
from typing import List, Dict, Literal
from database import db  # assume db is your SQLAlchemy or ORM interface

Status = Literal["pending", "approved", "rejected"]

def get_access_requests() -> List[Dict]:
    return db.fetch_all("SELECT * FROM access_requests")

def get_user_access_data() -> List[Dict]:
    return db.fetch_all("SELECT * FROM user_access")

def update_request_status(request_id: str, new_status: Status) -> bool:
    query = "UPDATE access_requests SET status = %s WHERE id = %s"
    return db.execute(query, (new_status, request_id))

def grant_access_to_user(request_id: str) -> bool:
    request = db.fetch_one("SELECT * FROM access_requests WHERE id = %s", (request_id,))
    if not request:
        return False

    regions = request["requested_regions"]
    user_name = request["user_name"]
    email = db.fetch_one("SELECT email FROM users WHERE name = %s", (user_name,))["email"]

    db.execute(
        "INSERT INTO user_access (user_name, email, regions, last_accessed) VALUES (%s, %s, %s, %s)",
        (user_name, email, regions, datetime.now().strftime("%Y-%m-%d %H:%M"))
    )
    return update_request_status(request_id, "approved")
