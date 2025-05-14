from db import execute_query, get_db_connection, update_simulation_status

TERMS_GAME1 = ["EBITDA", "Interest Rate", "Multiple", "Factor Score"]

def initialize(simulation_id: int):
    conn = get_db_connection()
    if not conn: return
    try:
        with conn.cursor() as cur:
            for term_name in TERMS_GAME1:
                cur.execute("""
                    SELECT term_id FROM game1_terms 
                    WHERE simulation_id = %s AND term_name = %s
                """, (simulation_id, term_name))
                if cur.fetchone() is None:
                    cur.execute("""
                        INSERT INTO game1_terms (simulation_id, term_name, team2_status, last_updated_by_team1_at)
                        VALUES (%s, %s, 'TBD', CURRENT_TIMESTAMP)
                    """, (simulation_id, term_name))
            conn.commit()
    except Exception as e:
        print(f"Error initializing terms: {e}")
        conn.rollback()
    finally:
        conn.close()


def get_team1_input(simulation_id: int, term_name: str):
    while True:
        try:
            if term_name == "Interest Rate":
                print("Note: Enter interest rate as a percentage (e.g., 5 for 5%).")
                value_str = input(f"Team 1, enter value for Interest Rate (%): ")
            else:
                value_str = input(f"Team 1, enter value for {term_name}: ")

            numeric_value = None
            if term_name == "EBITDA":
                numeric_value = float(value_str.replace('$', '').replace(' million', '')) * 1_000_000 if 'million' in value_str else float(value_str)
            elif term_name == "Interest Rate":
                numeric_value = float(value_str.replace('%', '')) / 100
            elif term_name == "Multiple" or term_name == "Factor Score":
                numeric_value = float(value_str)
                if term_name == "Factor Score" and not (1 <= numeric_value <= 5):
                    print("Factor Score must be between 1 and 5.")
                    continue
            
            query = """
                UPDATE game1_terms
                SET team1_value_text = %s, team1_value_numeric = %s, team2_status = 'TBD', last_updated_by_team1_at = CURRENT_TIMESTAMP
                WHERE simulation_id = %s AND term_name = %s;
            """
            if execute_query(query, (value_str, numeric_value, simulation_id, term_name), commit=True):
                print(f"{term_name} updated to {value_str}. Team 2 needs to review.")
                break
            else:
                print("Failed to update. Try again.")
        except ValueError:
            print("Invalid input type. Please enter a valid number or format.")
        except Exception as e:
            print(f"An error occurred: {e}")


def display_terms_and_outputs(simulation_id: int, team_id: int):
    query = "SELECT term_name, team1_value_text, team1_value_numeric, team2_status FROM game1_terms WHERE simulation_id = %s ORDER BY term_id;"
    terms = execute_query(query, (simulation_id,), fetch="all")

    if not terms:
        print("No terms found for this simulation.")
        return None, False 

    print(f"\n--- Simulation {simulation_id} - Current Status (Team {team_id}) ---")
    all_firm = True
    term_values_for_calc = {}

    for term in terms:
        print(f"  {term['term_name']}: {term['team1_value_text'] if term['team1_value_text'] else 'N/A'} (Team 2: {term['team2_status']})")
        if term['team2_status'] != 'OK':
            all_firm = False
        if term['team1_value_numeric'] is not None:
            term_values_for_calc[term['term_name']] = term['team1_value_numeric']
        elif term['term_name'] in ["EBITDA", "Multiple", "Factor Score"]:
            print(f"Warning: Numeric value missing for {term['term_name']}")
            all_firm = False

    valuation = None
    if all_firm and all(k in term_values_for_calc for k in ["EBITDA", "Multiple", "Factor Score"]):
        ebitda = term_values_for_calc["EBITDA"]
        multiple = term_values_for_calc["Multiple"]
        factor_score = term_values_for_calc["Factor Score"]
        valuation = ebitda * multiple * factor_score
        print(f"\n  Valuation: ${valuation:,.2f}")
    elif all_firm and not all(k in term_values_for_calc for k in ["EBITDA", "Multiple", "Factor Score"]):
        print("\n  Valuation: Cannot be calculated. Some numeric inputs are missing or not yet OK.")
        all_firm = False
    else:
        print("\n  Valuation: Not yet agreed by Team 2 (or inputs incomplete).")
        
    if all_firm:
        print("\nAll terms are FIRM!")
    else:
        print("\nSome terms are still TBD or inputs incomplete for valuation.")
    
    return terms, all_firm


def team1_flow(simulation_id: int):
    print(f"--- Team 1: Simulation {simulation_id} ---")
    initialize(simulation_id)

    while True:
        current_terms, all_firm = display_terms_and_outputs(simulation_id, 1)
        if all_firm:
            print("Simulation Game 1 completed!")
            update_simulation_status(simulation_id, "completed_game1")
            break

        print("\nTeam 1 Actions:")
        print("1. Input/Edit a term")
        print("2. Refresh status")
        print("3. Exit")
        choice = input("Choose action: ")

        if choice == '1':
            print("\nAvailable terms to edit:")
            for i, term_name in enumerate(TERMS_GAME1):
                print(f"{i+1}. {term_name}")
            term_choice_idx = input(f"Select term to edit (1-{len(TERMS_GAME1)}): ")
            try:
                selected_term_name = TERMS_GAME1[int(term_choice_idx) - 1]
                get_team1_input(simulation_id, selected_term_name)
            except (ValueError, IndexError):
                print("Invalid selection.")
        elif choice == '2':
            continue
        elif choice == '3':
            print("Exiting Team 1 session.")
            break
        else:
            print("Invalid choice.")


def team2_flow(simulation_id: int):
    print(f"--- Team 2: Simulation {simulation_id} ---")
    initialize(simulation_id)

    while True:
        current_terms, all_firm = display_terms_and_outputs(simulation_id, 2)
        if all_firm:
            print("Simulation Game 1 completed!")
            update_simulation_status(simulation_id, "completed_game1")
            break
        
        print("\nTeam 2 Actions:")
        print("1. Approve/Reject a term (Set OK/TBD)")
        print("2. Refresh status")
        print("3. Exit")
        choice = input("Choose action: ")

        if choice == '1':
            if not current_terms:
                print("No terms available to approve/reject yet.")
                continue
            
            print("\nSelect term to update status:")
            for i, term in enumerate(current_terms):
                print(f"{i+1}. {term['term_name']} (Current: {term['team2_status']})")
            
            term_choice_idx_str = input(f"Select term (1-{len(current_terms)}): ")
            try:
                term_choice_idx = int(term_choice_idx_str) - 1
                if not (0 <= term_choice_idx < len(current_terms)):
                    raise ValueError("Index out of bounds")
                
                selected_term = current_terms[term_choice_idx]
                new_status = ""
                while new_status not in ["OK", "TBD"]:
                    new_status = input(f"Set status for {selected_term['term_name']} to OK or TBD: ").upper()

                query = """
                    UPDATE game1_terms
                    SET team2_status = %s, last_updated_by_team2_at = CURRENT_TIMESTAMP
                    WHERE simulation_id = %s AND term_name = %s;
                """
                if execute_query(query, (new_status, simulation_id, selected_term['term_name']), commit=True):
                    print(f"{selected_term['term_name']} status updated to {new_status}.")
                else:
                    print("Failed to update status.")

            except (ValueError, IndexError):
                print("Invalid selection.")
        elif choice == '2':
            continue
        elif choice == '3':
            print("Exiting Team 2 session.")
            break
        else:
            print("Invalid choice.")