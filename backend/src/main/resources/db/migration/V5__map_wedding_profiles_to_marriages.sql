ALTER TABLE wedding_profiles ADD COLUMN IF NOT EXISTS marriage_id BIGINT;

UPDATE wedding_profiles wp
SET marriage_id = mm.marriage_id
FROM marriage_members mm
WHERE mm.user_id = wp.user_id
  AND mm.status = 'ACTIVE'
  AND wp.marriage_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uk_wedding_profiles_marriage
    ON wedding_profiles(marriage_id)
    WHERE marriage_id IS NOT NULL;
