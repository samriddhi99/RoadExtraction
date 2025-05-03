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


def request_permission(user_id, request_data):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO permission_requests (user_id, area, reason, status)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            user_id,
            request_data.get("area"),
            request_data.get("reason"),
            "pending"
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


def search_location(user_id, query):
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)

        sql_query = process_query(query)
        cursor.execute(sql_query)
        return cursor.fetchall()

    except Error as e:
        print(f"[!] MySQL Error: {e}")
        return []

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


def get_notifications(user_id):
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT change_detected, metadata, image_url FROM notifications WHERE user_id = %s"
        cursor.execute(query, (user_id,))
        return cursor.fetchall()

    except Error as e:
        print(f"[!] MySQL Error: {e}")
        return []

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
