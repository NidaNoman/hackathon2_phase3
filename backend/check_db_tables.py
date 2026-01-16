# backend/check_db_tables.py

import os
import sys
from sqlalchemy import create_engine, inspect
from sqlalchemy.exc import OperationalError, ProgrammingError

# This is to ensure the script can find the 'app' module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.core.config import settings
    print("Successfully imported settings.")
    print(f"Database URL detected: ...{settings.DATABASE_URL[-20:]}") # Print last 20 chars for verification
except ImportError as e:
    print(f"Error: Could not import settings. Make sure you are running this script from the 'backend' directory. Details: {e}")
    sys.exit(1)

def check_tables():
    """Connects to the database and lists all tables."""
    try:
        print("\nAttempting to connect to the database...")
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as connection:
            print("Database connection successful!")
            inspector = inspect(engine)
            table_names = inspector.get_table_names()

            if table_names:
                print("\nTables found in the database:")
                for name in table_names:
                    print(f"- {name}")
                if 'user' not in table_names or 'task' not in table_names:
                    print("\nWarning: The required 'user' and/or 'task' tables are missing.")
                    print("This is very likely the cause of the '500 Internal Server Error'.")
            else:
                print("\nNo tables found in the database.")
                print("This is the cause of the '500 Internal Server Error'.")

    except OperationalError as e:
        print("\nError: Could not connect to the database.")
        print("Please check the following:")
        print("1. Your DATABASE_URL in the .env file is correct.")
        print("2. Your internet connection is working.")
        print("3. The Neon database is active and not suspended.")
        print(f"Details: {e}")
    except ProgrammingError as e:
        print(f"\nProgramming Error: This might indicate a problem with permissions or database configuration.")
        print(f"Details: {e}")
    except Exception as e:
        print(f"\nAn unexpected error occurred: {e}")

if __name__ == "__main__":
    check_tables()
