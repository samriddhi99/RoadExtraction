import mysql.connector
from mysql.connector import Error
from utils.nlp import process_query


def connect_db():
    return mysql.connector.connect(
        host='localhost',
        database='change_detection',
        user='root',
        password='root'
    )


def get_accessible_locations(user_id):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        query = "SELECT accessible_locations FROM users WHERE user_id = %s"
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()

        if result:
            return result[0].split(',')  # Assuming it's a comma-separated string
        return []

    except Error as e:
        print(f"[!] MySQL Error: {e}")
        return []

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


def register_request(request_data):
    print("[+] Registering permission request...")
    try:
        conn = connect_db()
        cursor = conn.cursor()

        insert_query = """
        INSERT INTO permission_requests (
        full_name, email, phone_number, department, designation,
        locations, justification, supervisor_info, additional_comments
    )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        # Assuming request_data is a dictionary with the required fields
        cursor.execute(insert_query, (
            request_data.get("fullName"),
            request_data.get("email"),
            request_data.get("phoneNumber"),
            request_data.get("department"),
            request_data.get("designation"),
            ",".join(request_data.get("locations", [])),  # flatten list to comma-separated string
            request_data.get("justification"),
            request_data.get("supervisorInfo"),
            request_data.get("additionalComments")
        ))


        conn.commit()
        return {
            "message": "Permission request submitted",
            "request_id": cursor.lastrowid
        }

    except Error as e:
        print(f"[!] MySQL Error: {e}")
        return {"message": "Failed to submit permission request"}

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()



def get_notifications(user_id):
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM notifications WHERE user_id = %s"
        cursor.execute(query, (user_id,))
        return cursor.fetchall()

    except Error as e:
        print(f"[!] MySQL Error: {e}")
        return []

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
