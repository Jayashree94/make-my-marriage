package com.makemymarriage.members;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberInvitationService {
    private final JdbcTemplate jdbcTemplate;
    private final ResendEmailService resendEmailService;
    private final String frontendUrl;

    public MemberInvitationService(
        JdbcTemplate jdbcTemplate,
        ResendEmailService resendEmailService,
        @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl
    ) {
        this.jdbcTemplate = jdbcTemplate;
        this.resendEmailService = resendEmailService;
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
    }

    public MemberDtos.MembersResponse list(String email) {
        long userId = currentUserId(email);
        long marriageId = currentMarriageId(userId, email);
        String currentRole = currentRole(marriageId, userId);

        List<MemberDtos.MemberResponse> members = jdbcTemplate.query("""
            SELECT u.id, u.first_name, u.last_name, u.email, mm.role, mm.status
            FROM marriage_members mm
            JOIN users u ON u.id = mm.user_id
            WHERE mm.marriage_id = ?
            ORDER BY mm.joined_at DESC
            """, (rs, rowNum) -> new MemberDtos.MemberResponse(
                rs.getLong("id"),
                (rs.getString("first_name") + " " + rs.getString("last_name")).trim(),
                rs.getString("email"),
                normalizeRole(rs.getString("role")),
                rs.getString("status")
            ), marriageId);

        List<MemberDtos.InvitationResponse> invitations = jdbcTemplate.query("""
            SELECT id, email, display_name, role, status, expires_at, sent_at, accepted_at
            FROM member_invitations
            WHERE marriage_id = ?
            ORDER BY created_at DESC
            """, (rs, rowNum) -> new MemberDtos.InvitationResponse(
                rs.getObject("id", UUID.class),
                rs.getString("email"),
                rs.getString("display_name"),
                normalizeRole(rs.getString("role")),
                rs.getString("status"),
                toInstant(rs.getTimestamp("expires_at")),
                toInstant(rs.getTimestamp("sent_at")),
                toInstant(rs.getTimestamp("accepted_at"))
            ), marriageId);

        String name = jdbcTemplate.queryForObject(
            "SELECT name FROM marriages WHERE id = ?", String.class, marriageId
        );
        return new MemberDtos.MembersResponse(marriageId, name, currentRole, members, invitations);
    }

    public MemberDtos.InvitationResponse invite(String email, MemberDtos.InviteRequest request) {
        return invite(email, request, frontendUrl);
    }

    public MemberDtos.InvitationResponse invite(
        String email,
        MemberDtos.InviteRequest request,
        String requestedFrontendUrl
    ) {
        if (request == null || request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Invitation email is required.");
        }
        String recipient = request.email().trim().toLowerCase();
        String displayName = request.displayName() == null ? "" : request.displayName().trim();
        String role = normalizeRole(request.role());

        long userId = currentUserId(email);
        long marriageId = currentMarriageId(userId, email);
        requireCanInvite(marriageId, userId);

        Integer existing = jdbcTemplate.queryForObject("""
            SELECT COUNT(*) FROM member_invitations
            WHERE marriage_id = ? AND lower(email) = ? AND status IN ('PENDING', 'SENT')
            """, Integer.class, marriageId, recipient);
        if (existing != null && existing > 0) {
            throw new IllegalArgumentException("This member already has a pending invitation.");
        }

        UUID invitationId = UUID.randomUUID();
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(
            new SecureRandom().generateSeed(32)
        );
        String tokenHash = sha256(rawToken);
        Instant expiresAt = Instant.now().plusSeconds(72 * 60 * 60);

        jdbcTemplate.update("""
            INSERT INTO member_invitations
                (id, marriage_id, email, display_name, role, token_hash, status, invited_by, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)
            """, invitationId, marriageId, recipient, displayName, role, tokenHash, userId,
            Timestamp.from(expiresAt));

        String marriageName = jdbcTemplate.queryForObject(
            "SELECT name FROM marriages WHERE id = ?", String.class, marriageId
        );
        String acceptUrl = normalizeFrontendUrl(requestedFrontendUrl) + "/members/accept/" + rawToken;
        try {
            resendEmailService.sendInvitation(
                recipient, displayName.isBlank() ? recipient : displayName,
                marriageName, role, acceptUrl
            );
        } catch (RuntimeException exception) {
            jdbcTemplate.update("""
                UPDATE member_invitations
                SET status = 'FAILED', updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                """, invitationId);
            throw exception;
        }

        jdbcTemplate.update("""
            UPDATE member_invitations
            SET status = 'SENT', sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """, invitationId);

        return findInvitation(invitationId);
    }

    public MemberDtos.InvitationResponse resend(String email, UUID invitationId) {
        return resend(email, invitationId, frontendUrl);
    }

    public MemberDtos.InvitationResponse resend(
        String email,
        UUID invitationId,
        String requestedFrontendUrl
    ) {
        long userId = currentUserId(email);
        long marriageId = currentMarriageId(userId, email);
        requireCanInvite(marriageId, userId);

        var row = jdbcTemplate.queryForMap("""
            SELECT mi.*, m.name AS marriage_name
            FROM member_invitations mi
            JOIN marriages m ON m.id = mi.marriage_id
            WHERE mi.id = ? AND mi.marriage_id = ?
            """, invitationId, marriageId);

        if (!List.of("PENDING", "SENT", "FAILED").contains(String.valueOf(row.get("status")))) {
            throw new IllegalArgumentException("Only pending or failed invitations can be resent.");
        }

        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(
            new SecureRandom().generateSeed(32)
        );
        String tokenHash = sha256(rawToken);
        Instant expiresAt = Instant.now().plusSeconds(72 * 60 * 60);
        jdbcTemplate.update("""
            UPDATE member_invitations
            SET token_hash = ?, expires_at = ?, status = 'PENDING',
                updated_at = CURRENT_TIMESTAMP, sent_at = NULL
            WHERE id = ?
            """, tokenHash, Timestamp.from(expiresAt), invitationId);

        try {
            resendEmailService.sendInvitation(
                String.valueOf(row.get("email")),
                String.valueOf(row.get("display_name")),
                String.valueOf(row.get("marriage_name")),
                String.valueOf(row.get("role")),
                normalizeFrontendUrl(requestedFrontendUrl) + "/members/accept/" + rawToken
            );
        } catch (RuntimeException exception) {
            jdbcTemplate.update("""
                UPDATE member_invitations
                SET status = 'FAILED', updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                """, invitationId);
            throw exception;
        }
        jdbcTemplate.update("""
            UPDATE member_invitations
            SET status = 'SENT', sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """, invitationId);
        return findInvitation(invitationId);
    }

    @Transactional
    public void revoke(String email, UUID invitationId) {
        long userId = currentUserId(email);
        long marriageId = currentMarriageId(userId, email);
        requireCanInvite(marriageId, userId);
        int updated = jdbcTemplate.update("""
            DELETE FROM member_invitations
            WHERE id = ? AND marriage_id = ? AND status <> 'ACCEPTED'
            """, invitationId, marriageId);
        if (updated != 1) throw new IllegalArgumentException("Invitation could not be revoked.");
    }

    @Transactional
    public void revokeMember(String email, long memberUserId) {
        long userId = currentUserId(email);
        long marriageId = currentMarriageId(userId, email);
        requireAdmin(marriageId, userId);
        if (memberUserId == userId) {
            throw new IllegalArgumentException("The wedding administrator account cannot revoke itself.");
        }
        int deleted = jdbcTemplate.update("""
            DELETE FROM marriage_members
            WHERE marriage_id = ? AND user_id = ? AND status = 'ACTIVE'
            """, marriageId, memberUserId);
        if (deleted != 1) throw new IllegalArgumentException("Member could not be revoked.");
    }

    @Transactional
    public MemberDtos.InvitationPreview preview(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Invitation token is required.");
        }
        var invitation = jdbcTemplate.queryForMap("""
            SELECT mi.email, mi.display_name, mi.role, mi.status, mi.expires_at, m.name AS marriage_name
            FROM member_invitations mi
            JOIN marriages m ON m.id = mi.marriage_id
            WHERE mi.token_hash = ?
            """, sha256(rawToken));
        Timestamp expiresAt = (Timestamp) invitation.get("expires_at");
        String status = String.valueOf(invitation.get("status"));
        if (expiresAt.toInstant().isBefore(Instant.now())) {
            throw new IllegalArgumentException("This invitation has expired.");
        }
        if (!List.of("PENDING", "SENT").contains(status)) {
            throw new IllegalArgumentException("This invitation is no longer valid.");
        }
        return new MemberDtos.InvitationPreview(
            String.valueOf(invitation.get("marriage_name")),
            String.valueOf(invitation.get("email")),
            String.valueOf(invitation.get("display_name")),
            normalizeRole(String.valueOf(invitation.get("role"))),
            status
        );
    }

    @Transactional
    public void reject(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Invitation token is required.");
        }
        String invitationTokenHash = sha256(rawToken);
        var invitation = jdbcTemplate.query("""
            SELECT mi.id, mi.marriage_id, mi.email
            FROM member_invitations mi
            WHERE mi.token_hash = ? AND mi.status IN ('PENDING', 'SENT')
            """, rs -> rs.next() ? new Object[]{
                rs.getObject("id", UUID.class),
                rs.getLong("marriage_id"),
                rs.getString("email")
            } : null, invitationTokenHash);
        if (invitation == null) {
            throw new IllegalArgumentException("This invitation is no longer valid.");
        }

        int updated = jdbcTemplate.update("""
            UPDATE member_invitations
            SET status = 'REJECTED', updated_at = CURRENT_TIMESTAMP
            WHERE token_hash = ? AND status IN ('PENDING', 'SENT')
            """, invitationTokenHash);
        if (updated != 1) {
            throw new IllegalArgumentException("This invitation is no longer valid.");
        }
        jdbcTemplate.update("""
            DELETE FROM marriage_members mm
            WHERE mm.marriage_id = ?
              AND mm.user_id IN (
                  SELECT u.id FROM users u WHERE lower(u.email) = lower(?)
              )
            """, ((Number) invitation[1]).longValue(), invitation[2]);
    }

    @Transactional
    public void accept(String email, String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Invitation token is required.");
        }
        String tokenHash = sha256(rawToken);
        var invitation = jdbcTemplate.queryForMap("""
            SELECT id, marriage_id, role, email, status, expires_at
            FROM member_invitations
            WHERE token_hash = ?
            """, tokenHash);
        Timestamp expiresAt = (Timestamp) invitation.get("expires_at");
        String status = String.valueOf(invitation.get("status"));
        if (!List.of("PENDING", "SENT").contains(status)) {
            throw new IllegalArgumentException("This invitation is no longer valid.");
        }
        if (expiresAt.toInstant().isBefore(Instant.now())) {
            throw new IllegalArgumentException("This invitation has expired.");
        }

        String invitedEmail = String.valueOf(invitation.get("email"));
        if (!invitedEmail.equalsIgnoreCase(email)) {
            throw new IllegalArgumentException("Sign in with the invited email address to accept.");
        }

        long marriageId = ((Number) invitation.get("marriage_id")).longValue();
        long userId = currentUserId(email);
        jdbcTemplate.update("""
            DELETE FROM marriage_members WHERE user_id = ?
            """, userId);
        jdbcTemplate.update("""
            INSERT INTO marriage_members (marriage_id, user_id, role, status, invited_by)
            SELECT ?, ?, ?, 'ACTIVE', invited_by
            FROM member_invitations
            WHERE id = ?
            """, marriageId, userId, String.valueOf(invitation.get("role")),
            invitation.get("id"));
        jdbcTemplate.update("""
            DELETE FROM member_invitations WHERE id = ?
            """, invitation.get("id"));
    }

    private long currentMarriageId(long userId, String email) {
        Long existing = jdbcTemplate.query("""
            SELECT mm.marriage_id FROM marriage_members mm
            WHERE mm.user_id = ? AND mm.status = 'ACTIVE'
            ORDER BY mm.joined_at DESC LIMIT 1
            """, rs -> rs.next() ? rs.getLong(1) : null, userId);
        if (existing != null) return existing;

        Long owned = jdbcTemplate.query("""
            SELECT id FROM marriages WHERE created_by = ? AND deleted_at IS NULL
            ORDER BY created_at DESC LIMIT 1
            """, rs -> rs.next() ? rs.getLong(1) : null, userId);
        if (owned != null) return owned;

        String[] name = jdbcTemplate.queryForObject(
            "SELECT first_name, last_name FROM users WHERE id = ?", (rs, rowNum) ->
                new String[]{rs.getString(1), rs.getString(2)}, userId
        );
        String marriageName = (((name[0] == null ? "" : name[0].trim()) + " "
            + (name[1] == null ? "" : name[1].trim())).trim()) + " Wedding";

        Long id = jdbcTemplate.queryForObject("""
            INSERT INTO marriages (name, created_by)
            VALUES (?, ?)
            RETURNING id
            """, Long.class, marriageName, userId);
        jdbcTemplate.update("""
            INSERT INTO marriage_members (marriage_id, user_id, role, status, invited_by)
            VALUES (?, ?, 'OWNER', 'ACTIVE', ?)
            """, id, userId, userId);
        return id;
    }

    private void requireCanInvite(long marriageId, long userId) {
        requireAdmin(marriageId, userId);
    }

    private void requireAdmin(long marriageId, long userId) {
        String role = currentRole(marriageId, userId);
        if (!"ADMIN".equals(role)) {
            throw new IllegalArgumentException("Only wedding administrators can manage members.");
        }
    }

    private String currentRole(long marriageId, long userId) {
        String role = jdbcTemplate.query("""
            SELECT role FROM marriage_members
            WHERE marriage_id = ? AND user_id = ? AND status = 'ACTIVE'
            """, rs -> rs.next() ? rs.getString(1) : null, marriageId, userId);
        return switch (role == null ? "" : role.trim().toUpperCase()) {
            case "OWNER", "ADMIN" -> "ADMIN";
            default -> "MANAGER";
        };
    }

    private long currentUserId(String email) {
        Long id = jdbcTemplate.query(
            "SELECT id FROM users WHERE lower(email) = ?",
            rs -> rs.next() ? rs.getLong(1) : null,
            email.toLowerCase()
        );
        if (id == null) throw new IllegalArgumentException("User not found.");
        return id;
    }

    private MemberDtos.InvitationResponse findInvitation(UUID id) {
        return jdbcTemplate.queryForObject("""
            SELECT id, email, display_name, role, status, expires_at, sent_at, accepted_at
            FROM member_invitations WHERE id = ?
            """, (rs, rowNum) -> new MemberDtos.InvitationResponse(
                rs.getObject("id", UUID.class),
                rs.getString("email"),
                rs.getString("display_name"),
                normalizeRole(rs.getString("role")),
                rs.getString("status"),
                toInstant(rs.getTimestamp("expires_at")),
                toInstant(rs.getTimestamp("sent_at")),
                toInstant(rs.getTimestamp("accepted_at"))
            ), id);
    }

    private String normalizeRole(String role) {
        return switch (role == null ? "" : role.trim().toUpperCase().replace(" ", "_")) {
            case "MANAGER" -> "MANAGER";
            case "ADMIN" -> "ADMIN";
            default -> "MANAGER";
        };
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return Base64.getUrlEncoder().withoutPadding().encodeToString(
                digest.digest(value.getBytes(StandardCharsets.UTF_8))
            );
        } catch (Exception exception) {
            throw new IllegalStateException("Could not secure invitation token.", exception);
        }
    }

    private String normalizeFrontendUrl(String value) {
        return value == null || value.isBlank()
            ? frontendUrl
            : value.replaceAll("/+$", "");
    }

    private Instant toInstant(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toInstant();
    }
}
