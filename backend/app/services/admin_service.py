from datetime import datetime
import mysql.connector
from mysql.connector import Error
def connect_db():
    return mysql.connector.connect(
        host='localhost',
        database='change_detection',
        user='root',
        password='root'
    )

def get_access_requests():
    print("[+] Fetching access requests...")
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT id, full_name, department, locations, submitted_at, status FROM permission_requests WHERE status = 'pending'"
        cursor.execute(query)
        requests = cursor.fetchall()
        print(requests)
        return requests
    except Error as e:
        print("Error fetching access requests:", e)
        return []
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


def get_user_access_data(user_id):
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM permission_requests WHERE id = %s"
        cursor.execute(query, (user_id,))
        user_requests = cursor.fetchall()
        return user_requests
    except Error as e:
        print("Error fetching user access data:", e)
        return []
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def update_request_status(request_id, new_status):
    try:
        conn = connect_db()
        cursor = conn.cursor()
        query = "UPDATE access_requests SET status = %s WHERE id = %s"
        cursor.execute(query, (new_status, request_id))
        conn.commit()
        return True
    except Error as e:
        print("Error updating request status:", e)
        return False
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def grant_access_to_user(request_id):
    try:
        conn = connect_db()
        cursor = conn.cursor()
        # Fetch the request details
        query = "SELECT * FROM permission_requests WHERE id = %s"
        cursor.execute(query, (request_id,))
        request_data = cursor.fetchone()

        if not request_data:
            print("Request not found")
            return False

        # Extract user details from the request
        user_id = request_data[1]  # Assuming user_id is in the second column
        locations = request_data[6]  # Assuming locations are in the seventh column

        # Update the user's accessible locations
        update_query = "UPDATE users SET accessible_locations = %s WHERE user_id = %s"
        cursor.execute(update_query, (locations, user_id))
        
        # Update the request status to 'approved'
        update_request_query = "UPDATE permission_requests SET status = 'approved' WHERE id = %s"
        cursor.execute(update_request_query, (request_id,))
        
        conn.commit()
        return True
    except Error as e:
        print("Error granting access:", e)
        return False
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
