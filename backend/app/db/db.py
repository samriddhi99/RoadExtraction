import mysql.connector
from mysql.connector import Error

def connect_to_mysql():
    try:
        connection = mysql.connector.connect(
            host='localhost',          
            database='change_detection',   
            user='root',
            password='root'              
        )

        if connection.is_connected():
            print("Successfully connected to MySQL")

        # Your database interaction logic goes here
        cursor = connection.cursor()
        cursor.execute("SELECT DATABASE();")
        record = cursor.fetchone()
        print(f"You're connected to the database: {record}")

        cursor.close()

    except Error as e:
        print(f"Error: {e}")
    
    finally:
        if connection.is_connected():
            connection.close()
            print("Connection closed.")

# Call the function
connect_to_mysql()
