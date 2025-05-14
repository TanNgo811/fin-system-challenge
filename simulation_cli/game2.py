from db import execute_query, update_simulation_status

COMPANIES = ["Company 1", "Company 2", "Company 3"]
INVESTORS = ["Investor 1", "Investor 2", "Investor 3"]

def team1_input_game2(simulation_id: int):
    print(f"--- Team 1: Simulation {simulation_id} - Game 2 Inputs ---")
    search_query = "SELECT simulation_id FROM simulations WHERE simulation_id = %s;"
    res = execute_query(search_query, (simulation_id,), fetch="one")
    if not res:
        print(f"Simulation ID {simulation_id} not found.")
        return
    print(f"Simulation ID {simulation_id} found. Re-enter inputs.")
    # Clear previous inputs for the simulation
    execute_query("DELETE FROM game2_team1_inputs WHERE simulation_id = %s;", (simulation_id,), commit=True)
    
    all_inputs_successful = True
    for company in COMPANIES:
        print(f"\nInput for {company}:")
        while True:
            try:
                price = float(input(f"  Price for {company}: "))
                shares = int(input(f"  Shares offered for {company}: "))
                
                query = """
                    INSERT INTO game2_team1_inputs (simulation_id, company_name, price, shares_offered)
                    VALUES (%s, %s, %s, %s);
                """
                if not execute_query(query, (simulation_id, company, price, shares), commit=True):
                    print(f"Failed to save inputs for {company}. Please try again or check DB connection.")
                    all_inputs_successful = False
                    break
                break
            except ValueError:
                print("Invalid input. Price should be a number, Shares should be an integer.")
            except Exception as e:
                print(f"An error occurred: {e}")
                all_inputs_successful = False
                break
        if not all_inputs_successful:
             break


    if all_inputs_successful:
        print("\nTeam 1 inputs for Game 2 submitted.")
        check_and_update_game2_status(simulation_id, "team1_submitted")
    else:
        print("\nTeam 1 inputs for Game 2 were not fully submitted due to errors.")


def team2_input_game2(simulation_id: int):
    print(f"--- Team 2: Simulation {simulation_id} - Game 2 Inputs ---")
    execute_query("DELETE FROM game2_team2_bids WHERE simulation_id = %s;", (simulation_id,), commit=True)

    all_inputs_successful = True
    for investor in INVESTORS:
        print(f"\nInput for {investor}:")
        for company in COMPANIES:
            while True:
                try:
                    shares_bid = int(input(f"  Shares bid by {investor} for {company}: "))
                    query = """
                        INSERT INTO game2_team2_bids (simulation_id, investor_name, company_name, shares_bid)
                        VALUES (%s, %s, %s, %s);
                    """
                    if not execute_query(query, (simulation_id, investor, company, shares_bid), commit=True):
                         print(f"Failed to save bid for {investor} for {company}. Please try again or check DB connection.")
                         all_inputs_successful = False
                         break
                    break
                except ValueError:
                    print("Invalid input. Shares bid must be an integer.")
                except Exception as e:
                    print(f"An error occurred: {e}")
                    all_inputs_successful = False
                    break
            if not all_inputs_successful:
                break
        if not all_inputs_successful:
            break


    if all_inputs_successful:
        print("\nTeam 2 inputs for Game 2 submitted.")
        check_and_update_game2_status(simulation_id, "team2_submitted")
    else:
        print("\nTeam 2 inputs for Game 2 were not fully submitted due to errors.")


def check_and_update_game2_status(simulation_id: int, team_submitted: str):
    current_status_query = "SELECT status FROM simulations WHERE simulation_id = %s;"
    res = execute_query(current_status_query, (simulation_id,), fetch="one")
    current_status = res['status'] if res else None

    new_status = None
    if team_submitted == "team1_submitted":
        if current_status == "team2_submitted_game2":
            new_status = "both_submitted_game2"
        else:
            new_status = "team1_submitted_game2"
    elif team_submitted == "team2_submitted":
        if current_status == "team1_submitted_game2":
            new_status = "both_submitted_game2"
        else:
            new_status = "team2_submitted_game2"
    
    if new_status:
        update_query = "UPDATE simulations SET status = %s WHERE simulation_id = %s;"
        execute_query(update_query, (new_status, simulation_id), commit=True)


def calculate_and_display_game2_outputs(simulation_id: int, team_id: int = None):
    print(f"\n--- Team {team_id} - Simulation {simulation_id} - Game 2 Outputs ---")

    team1_inputs_q = "SELECT company_name, price, shares_offered FROM game2_team1_inputs WHERE simulation_id = %s;"
    team1_data_rows = execute_query(team1_inputs_q, (simulation_id,), fetch="all")
    if not team1_data_rows:
        print("Team 1 inputs not found.")
        return

    team2_bids_q = "SELECT company_name, investor_name, shares_bid FROM game2_team2_bids WHERE simulation_id = %s;"
    team2_data_rows = execute_query(team2_bids_q, (simulation_id,), fetch="all")
    if not team2_data_rows:
        print("Team 2 bids not found.")
        return
    
    # Print team 2 bids for team 1
    if team_id == 1:
        print(f"{'Shares Bid':<14} {'Company 1':<14} {'Company 2':<14} {'Company 3'}")
        for investor in INVESTORS:
            print(f"{investor:<15}", end="")
            for company in COMPANIES:
                shares_bid = next((bid['shares_bid'] for bid in team2_data_rows if bid['investor_name'] == investor and bid['company_name'] == company), 0)
                print(f"{shares_bid:<15}", end="")
            print()
    else:
        print(f"{'Pricing':<14} {'Company 1':<14} {'Company 2':<14} {'Company 3'}")
        print(f"{'Price:':<15}", end="")
        for company in COMPANIES:
            price = next((row['price'] for row in team1_data_rows if row['company_name'] == company), 0)
            print(f"{price:<15}", end="")
        print()
        print(f"{'Shares:':<15}", end="")
        for company in COMPANIES:
            shares = next((row['shares_offered'] for row in team1_data_rows if row['company_name'] == company), 0)
            print(f"{shares:<15}", end="")
        print()

    # Process Team 1 data
    shares_offered_map = {row['company_name']: {'price': row['price'], 'shares': row['shares_offered']} for row in team1_data_rows}

    # Process Team 2 data
    bids_per_company = {company: 0 for company in COMPANIES}
    bids_detail = {company: [] for company in COMPANIES}

    for bid in team2_data_rows:
        bids_per_company[bid['company_name']] += bid['shares_bid']
        bids_detail[bid['company_name']].append({'investor': bid['investor_name'], 'shares': bid['shares_bid']})


    print("\n--- Summary ---")
    capital_raised_map = {}
    subscription_status_map = {}

    print(f"{'Summary':<17} {'Company 1':<14} {'Company 2':<14} {'Company 3'}")
    print(f"{'Shares Bid For:':<18}", end="")
    for company in COMPANIES:
        shares_bid = bids_per_company[company]
        print(f"{shares_bid:<15}", end="")
    print()

    print(f"{'Capital Raised:':<18}", end="")
    for company in COMPANIES:
        capital_raised = shares_offered_map[company]['price'] * min(bids_per_company[company], shares_offered_map[company]['shares'])
        print(f"{capital_raised:<15}", end="")
    print()
    
    print()
    print(f"{'Subscription':<17} {'Company 1':<14} {'Company 2':<14} {'Company 3'}")
    print(f"{'':<18}", end="")
    for company in COMPANIES:
        subscription = "N/A"
        if shares_offered_map[company]['shares'] > 0:
            if bids_per_company[company] > shares_offered_map[company]['shares']:
                subscription = "Over"
            elif bids_per_company[company] < shares_offered_map[company]['shares']:
                subscription = "Under"
            else:
                subscription = "Full"
        print(f"{subscription:<15}", end="")
    print()

    if bids_per_company:
        most_bids_company = max(bids_per_company, key=bids_per_company.get)
        max_bids_count = bids_per_company[most_bids_company]
        tied_companies = [comp for comp, count in bids_per_company.items() if count == max_bids_count]
        if len(tied_companies) > 1:
            print(f"\nCompanies that received the most bids ({max_bids_count} shares each): {', '.join(tied_companies)}")
        else:
            print(f"\nCompany that received the most bids: {most_bids_company} ({max_bids_count} shares)")
    else:
        print("\nNo bids recorded to determine which company received the most.")
    
    update_simulation_status(simulation_id, "completed_game2")


def game2_flow(simulation_id: int, team_id: int):
    if team_id == 1:
        team1_input_game2(simulation_id)
    elif team_id == 2:
        team2_input_game2(simulation_id)
    else:
        print("Invalid team ID for Game 2.")
        return

    sim_status_res = execute_query("SELECT status FROM simulations WHERE simulation_id = %s;", (simulation_id,), fetch="one")
    if sim_status_res and sim_status_res['status'] == 'both_submitted_game2':
        print("\nBoth teams have submitted their inputs for Game 2. Calculating outputs...")
        calculate_and_display_game2_outputs(simulation_id, team_id)
    elif sim_status_res:
        print(f"\nGame 2 status: {sim_status_res['status']}. Waiting for the other team to submit inputs.")