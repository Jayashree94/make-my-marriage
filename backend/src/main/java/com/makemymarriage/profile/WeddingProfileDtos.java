package com.makemymarriage.profile;

import java.time.Instant;

public class WeddingProfileDtos {
    public record SaveRequest(String profileJson) {
    }

    public record ProfileResponse(String profileJson, Instant updatedAt) {
    }
}
