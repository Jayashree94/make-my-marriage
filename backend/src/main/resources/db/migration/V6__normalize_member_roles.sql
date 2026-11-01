UPDATE marriage_members
SET role = CASE
    WHEN role = 'OWNER' OR role = 'ADMIN' THEN 'ADMIN'
    ELSE 'MANAGER'
END;

UPDATE member_invitations
SET role = CASE
    WHEN role = 'ADMIN' THEN 'ADMIN'
    ELSE 'MANAGER'
END;
