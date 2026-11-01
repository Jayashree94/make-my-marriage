WITH duplicate_memberships AS (
    SELECT ctid,
           ROW_NUMBER() OVER (
               PARTITION BY user_id
               ORDER BY
                   CASE WHEN status = 'ACTIVE' THEN 0 ELSE 1 END,
                   joined_at DESC,
                   ctid DESC
           ) AS membership_rank
    FROM marriage_members
)
DELETE FROM marriage_members mm
USING duplicate_memberships dm
WHERE mm.ctid = dm.ctid
  AND dm.membership_rank > 1;

CREATE UNIQUE INDEX IF NOT EXISTS uq_marriage_members_user_id
    ON marriage_members(user_id);
