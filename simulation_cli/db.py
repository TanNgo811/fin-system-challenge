import psycopg2
import psycopg2.extras

def get_db_connection():
    try:
        conn = psycopg2.connect(
            dbname="finsim",
            user="admin",
            password="123456",
            host="localhost",
            port="5432"
        )
        return conn
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None

def execute_query(query, params=None, fetch=False, commit=False):
    conn = get_db_connection()
    if not conn:
        return None if fetch else False

    result = None
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(query, params)
            if fetch == "one":
                result = cur.fetchone()
            elif fetch == "all":
                result = cur.fetchall()
            
            if commit:
                conn.commit()
        return result if fetch else True
    except Exception as e:
        print(f"Database query error: {e}")
        if conn:
            conn.rollback()
        return None if fetch else False
    finally:
        if conn:
            conn.close()

def find_or_create_simulation(game_type: int) -> int | None:
    query = "INSERT INTO simulations (game_type, status) VALUES (%s, %s) RETURNING simulation_id;"
    params = (game_type, 'active')
    result = execute_query(query, params, fetch="one", commit=True)
    return result['simulation_id'] if result else None

def get_simulation_status(simulation_id: int):
    query = "SELECT status FROM simulations WHERE simulation_id = %s;"
    result = execute_query(query, (simulation_id,), fetch="one")
    return result['status'] if result else None

def get_simulation_game_type(simulation_id: int):
    query = "SELECT game_type FROM simulations WHERE simulation_id = %s;"
    result = execute_query(query, (simulation_id,), fetch="one")
    return result['game_type'] if result else None

def update_simulation_status(simulation_id: int, status: str):
    query = "UPDATE simulations SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE simulation_id = %s;"
    return execute_query(query, (status, simulation_id), commit=True)