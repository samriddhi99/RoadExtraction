# models/permission_request.py
from sqlalchemy import Column, String, Integer, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class PermissionRequest(Base):
    __tablename__ = 'permission_requests'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    department = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    locations_requested = Column(String, nullable=False)  # comma-separated list
    justification = Column(String, nullable=True)
    supervisor_contact = Column(String, nullable=True)
    additional_comments = Column(String, nullable=True)
    terms_agreed = Column(Boolean, default=False)
    confidentiality_agreed = Column(Boolean, default=False)
    status = Column(String, default="pending")  # pending / approved / rejected
    created_at = Column(DateTime, default=datetime.utcnow)
