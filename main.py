import pyodbc

conn = pyodbc.connect(
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=localhost\\SQLEXPRESS;'
    'DATABASE=Coffee Specialist DB;'
    'Trusted_Connection=yes;'
)

cursor = conn.cursor()
cursor.execute("SELECT name, address, rating FROM coffee_shops")

print("Список кофеен и баз данных:")
for row in cursor.fetchall():
    print(f"- {row[0]}, адрес: {row[1]}, рейтинг: {row[2]}")

conn.close()