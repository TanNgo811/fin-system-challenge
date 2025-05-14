CREATE TABLE simulations (
    simulation_id SERIAL PRIMARY KEY,
    game_type INTEGER NOT NULL, -- 1 for Game 1, 2 for Game 2
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game1_terms (
    term_id SERIAL PRIMARY KEY,
    simulation_id INTEGER REFERENCES simulations(simulation_id) ON DELETE CASCADE,
    term_name VARCHAR(100) NOT NULL,
    team1_value_text VARCHAR(255),
    team1_value_numeric DECIMAL,
    team2_status VARCHAR(10) DEFAULT 'TBD', -- 'TBD' or 'OK'
    last_updated_by_team1_at TIMESTAMP,
    last_updated_by_team2_at TIMESTAMP,
    UNIQUE (simulation_id, term_name)
);

CREATE TABLE game2_team1_inputs (
    input_id SERIAL PRIMARY KEY,
    simulation_id INTEGER REFERENCES simulations(simulation_id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    price DECIMAL NOT NULL,
    shares_offered INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (simulation_id, company_name)
);

CREATE TABLE game2_team2_bids (
    bid_id SERIAL PRIMARY KEY,
    simulation_id INTEGER REFERENCES simulations(simulation_id) ON DELETE CASCADE,
    investor_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    shares_bid INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_simulations_modtime
BEFORE UPDATE ON simulations
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- -- Delete database
-- DROP TABLE IF EXISTS game2_team2_bids;
-- DROP TABLE IF EXISTS game2_team1_inputs;
-- DROP TABLE IF EXISTS game1_terms;
-- DROP TABLE IF EXISTS simulations;

-- -- Delete sequences
-- DROP SEQUENCE IF EXISTS game2_team2_bids_bid_id_seq;
-- DROP SEQUENCE IF EXISTS game2_team1_inputs_input_id_seq;
-- DROP SEQUENCE IF EXISTS game1_terms_term_id_seq;
-- DROP SEQUENCE IF EXISTS simulations_simulation_id_seq;

-- -- Delete routines
-- DROP FUNCTION IF EXISTS update_modified_column();