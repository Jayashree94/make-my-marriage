CREATE TABLE IF NOT EXISTS wedding_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    profile_json TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_wedding_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_wedding_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_wedding_profiles_user_id
    ON wedding_profiles (user_id);
