from app.db import get_db
from datetime import datetime

def register_user(data):
    username = data.get('username')
    email = data.get('email')
    role = data.get('role', 'user')
    location_ids = data.get('location_ids', [])

    if not username or not email:
        return {'error': 'Username and email are required'}, 400

    db = get_db()
    cursor = db.cursor()

    try:
        # Insert into users
        insert_user = """
            INSERT INTO users (username, email, role, created_at)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_user, (username, email, role, datetime.utcnow()))
        user_id = cursor.lastrowid

        # Insert into user_locations if locations provided
        if location_ids:
            insert_access = """
                INSERT INTO user_locations (user_id, location_id)
                VALUES (%s, %s)
            """
            access_data = [(user_id, loc_id) for loc_id in location_ids]
            cursor.executemany(insert_access, access_data)

        db.commit()
        return {'message': 'User registered successfully', 'user_id': user_id}, 201

    except Exception as e:
        db.rollback()
        return {'error': str(e)}, 500

    finally:
        cursor.close()
        db.close()
