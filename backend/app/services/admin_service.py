from datetime import datetime
from typing import List, Dict, Literal


Status = Literal["pending", "approved", "rejected"]

def get_access_requests() -> List[Dict]:
    pass

def get_user_access_data() -> List[Dict]:
    pass
def update_request_status(request_id: str, new_status: Status) -> bool:
    query = "UPDATE access_requests SET status = %s WHERE id = %s"
    pass
def grant_access_to_user(request_id: str) -> bool:
    pass
  
