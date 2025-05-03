import mysql.connector
from mysql.connector import Error


def create_user(data):
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
                    regions, access_reason, supervisor_contact,
                    terms_agreed, confidentiality_agreed
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            cursor.execute(insert_query, (
                data['fullName'],
                data['email'],
                data['phoneNumber'],
                data['role'],
                data['designation'],
                data['department'],
                data['username'],
                (data['password']),  # safe hash
                ','.join(data['regions']),  # store regions as CSV
                data['accessReason'],
                data['supervisorContact'],
                data['termsAgreed'],
                data['confidentialityAgreed']
            ))

            connection.commit()
            print("[+] User created successfully")

    except Error as e:
        print(f"[!] MySQL Error: {e}")

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
