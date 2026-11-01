package com.makemymarriage.members;

import com.makemymarriage.common.api.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/members")
public class MemberInvitationController {
    private final MemberInvitationService service;

    public MemberInvitationController(MemberInvitationService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<MemberDtos.MembersResponse> list() {
        return ApiResponse.success(service.list(currentEmail()));
    }

    @PostMapping("/invitations")
    public ApiResponse<MemberDtos.InvitationResponse> invite(
        @RequestBody MemberDtos.InviteRequest request,
        HttpServletRequest httpRequest
    ) {
        return ApiResponse.success(service.invite(currentEmail(), request, frontendBaseUrl(httpRequest)));
    }

    @PostMapping("/invitations/{id}/resend")
    public ApiResponse<MemberDtos.InvitationResponse> resend(
        @PathVariable java.util.UUID id,
        HttpServletRequest httpRequest
    ) {
        return ApiResponse.success(service.resend(currentEmail(), id, frontendBaseUrl(httpRequest)));
    }

    @DeleteMapping("/invitations/{id}")
    public ApiResponse<String> revoke(@PathVariable java.util.UUID id) {
        service.revoke(currentEmail(), id);
        return ApiResponse.success("Invitation revoked.");
    }

    @DeleteMapping("/{userId}")
    public ApiResponse<String> revokeMember(@PathVariable long userId) {
        service.revokeMember(currentEmail(), userId);
        return ApiResponse.success("Member revoked.");
    }

    @PostMapping("/invitations/accept/{token}")
    public ApiResponse<String> accept(@PathVariable String token) {
        service.accept(currentEmail(), token);
        return ApiResponse.success("Invitation accepted.");
    }

    @GetMapping("/invitations/preview/{token}")
    public ApiResponse<MemberDtos.InvitationPreview> preview(@PathVariable String token) {
        return ApiResponse.success(service.preview(token));
    }

    @PostMapping("/invitations/reject/{token}")
    public ApiResponse<String> reject(@PathVariable String token) {
        service.reject(token);
        return ApiResponse.success("Invitation rejected.");
    }

    private String currentEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("User is not authenticated.");
        }
        return authentication.getName().toLowerCase();
    }

    private String frontendBaseUrl(HttpServletRequest request) {
        String origin = request.getHeader("Origin");
        if (origin != null && !origin.isBlank()) {
            return origin.replaceAll("/+$", "");
        }

        String forwardedHost = request.getHeader("X-Forwarded-Host");
        String forwardedProto = request.getHeader("X-Forwarded-Proto");
        if (forwardedHost != null && !forwardedHost.isBlank()) {
            String protocol = forwardedProto == null || forwardedProto.isBlank() ? "https" : forwardedProto.split(",")[0].trim();
            return protocol + "://" + forwardedHost.split(",")[0].trim();
        }

        String referer = request.getHeader("Referer");
        if (referer != null && !referer.isBlank()) {
            try {
                java.net.URI uri = java.net.URI.create(referer);
                if (uri.getScheme() != null && uri.getHost() != null) {
                    String port = uri.getPort() == -1 ? "" : ":" + uri.getPort();
                    return uri.getScheme() + "://" + uri.getHost() + port;
                }
            } catch (IllegalArgumentException ignored) {
            }
        }

        return "http://localhost:5173";
    }
}
