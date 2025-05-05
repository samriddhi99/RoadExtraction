import mysql.connector
from mysql.connector import Error


def create_user(data):
    print("[+] Creating user...")  
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='change_detection',
            user='root',
            password='root'
        )

        if connection.is_connected():
            cursor = connection.cursor()

            insert_query = """
                INSERT INTO users (
                    full_name, email, phone_number, role,
                    designation, department, username, password,
                    regions, access_reason, supervisor_contact
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            cursor.execute(insert_query, (
                data.get('fullName'),
                data.get('email'),
                data.get('phoneNumber'),
                data.get('role'),
                data.get('designation'),
                data.get('department'),
                data.get('username'),
                (data.get('password')),  # safe hash
                ','.join(data.get('regions')),  # store regions as CSV
                data.get('accessReason'),
                data.get('supervisorContact'),
            ))

            connection.commit()
            print("[+] User created successfully")

    except Error as e:
        print(f"[!] MySQL Error: {e}")

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


def login_user(data):
    print("[+] Logging in user...")
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='change_detection',
            user='root',
            password='root'
        )

        if connection.is_connected():
            cursor = connection.cursor()

            select_query = """
                SELECT * FROM users WHERE email = %s AND password = %s"""
            cursor.execute(select_query, (
                data.get('email'),
                (data.get('password')),  # safe hash
            ))
            print("Data:", data.get('email'), (data.get('password')))
            result = cursor.fetchone()
            if result:
                print("[+] User logged in successfully")
                return result
            else:
                print("[!] Invalid credentials")
                return None
    except Error as e:
        print(f"[!] MySQL Error: {e}")
        return None
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


def login_admin(data):
    print("[+] Logging in admin...")
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='change_detection',   
             user='root',
            password='root'
        )
        if connection.is_connected():
            cursor = connection.cursor()

            select_query = """
                SELECT * FROM users WHERE username = %s AND password = %s AND role = 'admin'
            """
            cursor.execute(select_query, (
                data.get('username'),
                (data.get('password')),  # safe hash
            ))
            result = cursor.fetchone()
            if result:
                print("[+] Admin logged in successfully")
                return result
            else:
                print("[!] Invalid credentials or not an admin")
                return None
    except Error as e:
        print(f"[!] MySQL Error: {e}")
        return None
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
