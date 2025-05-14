import argparse
from db import find_or_create_simulation, get_simulation_status, get_simulation_game_type
import game1
import game2

def main():
    parser = argparse.ArgumentParser(description="Finsimco Simulation CLI Game.")
    parser.add_argument("game_type", type=int, choices=[1, 2], help="Type of game (1 or 2).")
    parser.add_argument("team_id", type=int, choices=[1, 2], help="Team ID (1 or 2).")
    parser.add_argument("--sim_id", type=int, help="Optional: Existing Simulation ID to join.")

    args = parser.parse_args()

    simulation_id = args.sim_id
    if not simulation_id:
        print("No Simulation ID provided, attempting to create a new one.")
        simulation_id = find_or_create_simulation(args.game_type)
        if simulation_id:
            print(f"Started Simulation ID: {simulation_id}")
        else:
            print("Could not start or find a simulation. Exiting.")
            return
    else:
        print(f"Attempting to join Simulation ID: {simulation_id}")

    game_type = get_simulation_game_type(simulation_id)
    if game_type is None or game_type != args.game_type:
        print(f"Simulation ID {simulation_id} does not exist or is not of the specified game type.")
        print("Please provide a valid Simulation ID or start a new one.")
        return

    if args.game_type == 1:
        current_status = get_simulation_status(simulation_id)
        if current_status and "completed_game1" in current_status:
            print(f"Simulation {simulation_id} (Game 1) is already completed.")
            game1.display_terms_and_outputs(simulation_id, args.team_id)
            return
        
        if args.team_id == 1:
            game1.team1_flow(simulation_id)
        elif args.team_id == 2:
            game1.team2_flow(simulation_id)
            
    elif args.game_type == 2:
        current_status = get_simulation_status(simulation_id)
        if current_status and "completed_game2" in current_status:
            print(f"Simulation {simulation_id} (Game 2) is already completed.")
            game2.calculate_and_display_game2_outputs(simulation_id, team_id=args.team_id)
            return
        
        game2.game2_flow(simulation_id, args.team_id)

    else:
        print("Invalid game type specified.")

if __name__ == "__main__":
    main()