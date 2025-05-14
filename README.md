# Negotiation Simulation System

## Project Overview

This project is a negotiation simulation system developed as a solution to a technical challenge (based on "Updated Tech Test Excel.xlsx" and "Updated Tech Test.docx"). It comprises two main parts:

1.  **Backend CLI (Command Line Interface):** A Python-based application that manages the core logic for two distinct simulation games. It handles concurrent inputs from two teams, stores data in a PostgreSQL database, and calculates outputs based on team interactions.
2.  **Frontend UI (User Interface):** A React-based application (using ShadCN UI and TailwindCSS) that provides a mock user interface primarily for "Game 1" of the simulation. It demonstrates how Team 1 would input data and how Team 2 would view and approve terms, with dynamic UI updates. For the frontend challenge, data is mocked, and there is no direct backend communication.

## Features

### Backend CLI

- **Two Simulation Game Types:**
  - **Game 1 (Valuation Negotiation):** Team 1 inputs financial terms (EBITDA, Interest Rate, Multiple, Factor Score). Team 2 reviews and sets a TBD (To Be Determined) or OK status for each term. A final valuation is calculated once all terms are OK.
  - **Game 2 (Company Investment Bids):** Team 1 inputs pricing and shares offered for multiple companies. Team 2 (representing investors) inputs bids for shares in these companies. The system calculates outputs like total shares bid for, capital raised, subscription status, and identifies the company with the most bids.
- **Concurrent Team Inputs:** Designed for two separate instances of the CLI program (representing two teams) to interact with the same simulation data concurrently.
- **Persistent Data Storage:** Utilizes a PostgreSQL database to store all simulation data, including inputs, statuses, and timestamps.
- **Dynamic Output Calculation:** Outputs are calculated and displayed in the terminal based on the current state of inputs and approvals.
- **Input Editing:** Team 1 (in Game 1) can go back and edit previously entered values, which then resets the approval status for Team 2.

### Frontend UI (Mock Simulation for Game 1)

- **Dual Team Perspective:** Simulates views for both Team 1 (inputting data) and Team 2 (viewing data and toggling approval status). A switcher allows toggling between these perspectives.
- **Interactive Input Fields:** Functional input fields for EBITDA, Interest Rate, Multiple, Company Name, and Description, plus a slider for Factor Score.
- **Valuation:** Updates dynamically based on EBITDA, Multiple, and Factor Score, and contingent on all terms being "OK" (mocked approval from Team 2 view).
- **Pie Chart:** Visually represents Interest Rate.
- **Modals:** Sidebar buttons trigger modals displaying a placeholder video and a block of text (up to 500 characters).
- **Timer:** A simple counter that ticks forward, displaying elapsed time.
- **First-Time Guidance:** An accordion-style dropdown with introductory text, displayed on the first visit (persists state via `localStorage`).
- **Team-Specific Interactions (Mocked):**
  - Team 1 can edit input values. Changing a value resets its TBD/OK status.
  - Team 2 can toggle the TBD/OK status for each term. Input fields are read-only for Team 2.

## Tech Stack

- **Backend:**
  - Language: Python 3.10
  - Database: PostgreSQL
  - CLI Argument Parsing: `argparse`
  - PostgreSQL Adapter: `psycopg2-binary`
- **Frontend:**
  - Framework: ReactJS (with TypeScript)
  - UI Components: ShadCN UI
  - Styling: TailwindCSS
- **Database Management:** PostgreSQL (for running on Docker in a container)
- **Development Environment:**
  - Node.js & yarn (for frontend)
  - Python (for backend)

## Project Structure

```

.
├── simulation_cli/
│   ├── main.py             \# Main CLI entry point
│   ├── db.py               \# Database connection & utilities
│   ├── game1.py            \# Logic for Simulation Game 1
│   ├── game2.py            \# Logic for Simulation Game 2
│   ├── requirements.txt    \# Python dependencies
│   └── schema.sql          \# SQL schema definition
├── front_end/
│   ├── public/
│   ├── src/
│   │   ├── App.tsx         \# Main frontend application component
│   │   ├── components/     \# Reusable UI components
│   │   │   ├── ui/         \# ShadCN generated components
│   │   │   └── ...
│   │   ├── main.tsx        \# Main entry point for React
│   │   └── ...
│   ├── tailwind.config.js
│   ├── package.json
│   └── ...
└── README.md

```

## Setup and Installation

### Prerequisites

- Git
- Docker
- Python 3.10+ and Pip
- Node.js (v18+) and yarn

### 1. Backend Setup

#### a. Clone the Repository (if applicable)

```bash
git clone <repository-url>
cd <repository-folder>
```

#### b. Setup PostgreSQL with Docker

1.  **Pull the PostgreSQL image:**
    ```bash
    docker pull postgres
    ```
2.  **Run the PostgreSQL container:**
    ```bash
    docker run --name finsim \
      -e POSTGRES_USER=admin \
      -e POSTGRES_PASSWORD=123456 \
      -e POSTGRES_DB=finsim \
      -p 5432:5432 \
      -v postgres-data:/var/lib/postgresql/data \
      -d postgres
    ```

#### c. Apply Database Schema

1.  Locate the `simulation_cli/schema.sql` file containing the table definitions.
2.  Connect to your PostgreSQL instance (running in Docker).

#### d. Setup Python Environment & Dependencies

1.  Navigate to the backend directory:
    ```bash
    cd simulation_cli
    ```
2.  Create and activate a Python virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```
3.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd front_end
    ```
2.  Install Node.js dependencies:
    ```bash
    yarn install
    ```

## Running the Application

### Backend CLI

The backend CLI is run from the `simulation_cli` directory. Ensure your PostgreSQL Docker container is running.

**To start/join a simulation:**

`python main.py <game_type> <team_id> [--sim_id <simulation_id>]`

- `<game_type>`: `1` for Valuation Negotiation, `2` for Investment Bids.
- `<team_id>`: `1` or `2`.
- `[--sim_id <simulation_id>]`: Optional. If provided, the client attempts to join an existing simulation. If omitted for the first player, a new simulation is created, and its ID is displayed. The second player then uses this ID to join.

**Example: Game 1**

- **Terminal 1 (Team 1):**

  ```bash
  python main.py 1 1
  ```

  (Note the `Simulation ID` printed, e.g., `Started/Joined Simulation ID: 123`)

- **Terminal 2 (Team 2):**

  ```bash
  python main.py 1 2 --sim_id 123  # Use the ID from Team 1's session
  ```

Follow the on-screen prompts to interact with the simulation.

### Frontend UI

1.  Navigate to the frontend directory:

    ```bash
    cd frontend_ui
    ```

2.  Start the React development server:

    ```bash
    yarn dev
    ```

3.  **Switching Views:** The UI includes a toggle switch to change the perspective between "Team 1 (Editor)" and "Team 2 (Approver)" to demonstrate the different interaction modes for the mocked Game 1 scenario.
