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
        for d in requests:
            d["submitted_at"] = d["submitted_at"].strftime("%Y-%m-%d %H:%M:%S")
        print(requests)
        return requests
    except Error as e:
        print("Error fetching access requests:", e)
        return []
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


def get_user_access_data():
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT full_name, status, submitted_at FROM permission_requests WHERE status = 'approved'"
        cursor.execute(query)
        user_requests = cursor.fetchall()
        print("[+] USer access data returned")
        for d in user_requests:
            d["submitted_at"] = d["submitted_at"].strftime("%Y-%m-%d %H:%M:%S")

        print(user_requests)
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
        query = "UPDATE permission_requests SET status = %s WHERE id = %s"
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
        print("[+] Request data fetched")
        print(request_data)
        if not request_data:
            print("Request not found")
            return False

        user_id = request_data[1] 
        locations = request_data[6]  
        update_query = "UPDATE users SET regions = %s WHERE username = %s"
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
