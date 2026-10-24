CREATE TABLE IF NOT EXISTS marriages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_marriages_name ON marriages (name);
