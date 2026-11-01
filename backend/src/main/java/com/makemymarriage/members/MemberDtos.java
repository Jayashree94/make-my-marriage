package com.makemymarriage.members;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class MemberDtos {
    public record InviteRequest(String displayName, String email, String role) {
    }

    public record MemberResponse(Long userId, String displayName, String email, String role, String status) {
    }

    public record InvitationResponse(
        UUID id,
        String email,
        String displayName,
        String role,
        String status,
        Instant expiresAt,
        Instant sentAt,
        Instant acceptedAt
    ) {
    }

    public record InvitationPreview(
        String marriageName,
        String invitedEmail,
        String invitedName,
        String role,
        String status
    ) {
    }

    public record MembersResponse(
        Long marriageId,
        String marriageName,
        String currentRole,
        List<MemberResponse> members,
        List<InvitationResponse> invitations
    ) {
    }
}
