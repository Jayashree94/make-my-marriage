package com.makemymarriage.members;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ResendEmailService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ResendEmailService.class);
    private final RestClient resend;
    private final String fromEmail;
    private final boolean configured;

    public ResendEmailService(
        @Value("${app.resend.api-key:}") String apiKey,
        @Value("${app.resend.from-email:Make My Marriage <onboarding@resend.dev>}") String fromEmail
    ) {
        this.fromEmail = fromEmail;
        this.configured = apiKey != null && !apiKey.isBlank();
        this.resend = RestClient.builder()
            .baseUrl("https://api.resend.com")
            .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }

    public void sendInvitation(
        String recipient,
        String recipientName,
        String coupleName,
        String role,
        String acceptUrl
    ) {
        if (!configured) {
            throw new IllegalStateException(
                "Resend is not configured. Set RESEND_API_KEY before sending member invitations."
            );
        }

        Map<String, Object> body = Map.of(
            "from", fromEmail,
            "to", new String[]{recipient},
            "subject", coupleName + " invited you to their wedding workspace",
            "html", "<div style=\"font-family:Georgia,serif;color:#2b211e;padding:32px\">"
                + "<p>Dear " + escape(recipientName) + ",</p>"
                + "<p>You have been invited as <strong>" + escape(role) + "</strong> to "
                + escape(coupleName) + "'s wedding workspace.</p>"
                + "<p><a href=\"" + escape(acceptUrl) + "\" style=\"display:inline-block;background:#5b1e31;color:#fff;padding:12px 18px;text-decoration:none\">Accept invitation</a></p>"
                + "<p>This private invitation expires in 72 hours.</p></div>"
        );

        try {
            resend.post().uri("/emails").body(body).retrieve().toBodilessEntity();
        } catch (RestClientResponseException exception) {
            String providerBody = exception.getResponseBodyAsString();
            LOGGER.warn(
                "Resend rejected invitation delivery for {} with HTTP {}: {}",
                recipient,
                exception.getStatusCode().value(),
                providerBody
            );
            String detail = providerErrorDetail(providerBody);
            throw new IllegalArgumentException(
                "Resend rejected invitation delivery"
                    + (detail.isBlank() ? "." : ": " + detail)
                    + " If Make My Marriage <onboarding@resend.dev> is the sender, use a verified Resend account email as the recipient or verify a custom sender domain in Resend.",
                exception
            );
        } catch (Exception exception) {
            throw new IllegalArgumentException(
                "Invitation delivery could not be completed because the email service is unavailable. Please try again.",
                exception
            );
        }
    }

    private String escape(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace("\"", "&quot;").replace("'", "&#39;");
    }

    private String providerErrorDetail(String body) {
        if (body == null || body.isBlank()) return "";
        String normalized = body.replaceAll("\\s+", " ").trim();
        return normalized.length() <= 300 ? normalized : normalized.substring(0, 300) + "...";
    }
}
