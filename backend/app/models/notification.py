# models/notification.py
from sqlalchemy import Column, String, Integer, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, nullable=False)
    is_change_detected = Column(Boolean, nullable=False)
    metadata = Column(String, nullable=True)
    image_url = Column(String, nullable=True)  # or store actual image in S3 and just link here
    created_at = Column(DateTime, default=datetime.utcnow)

