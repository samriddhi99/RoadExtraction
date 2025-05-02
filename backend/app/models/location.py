from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.models import Base
from datetime import datetime

class LocationRequest(Base):
    __tablename__ = 'location_requests'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    location_name = Column(String(100), nullable=False)
    from_date = Column(String(50), nullable=False)
    to_date = Column(String(50), nullable=False)
    status = Column(String(20), default='pending')  # pending / approved / denied
    created_at = Column(DateTime, default=datetime.utcnow)
