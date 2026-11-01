package com.makemymarriage.profile;

import com.makemymarriage.auth.UserEntity;
import com.makemymarriage.auth.UserRepository;
import com.makemymarriage.common.api.ApiResponse;
import java.time.Instant;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/profile")
public class WeddingProfileController {

    private final UserRepository userRepository;
    private final WeddingProfileRepository profileRepository;
    private final JdbcTemplate jdbcTemplate;

    public WeddingProfileController(
        UserRepository userRepository,
        WeddingProfileRepository profileRepository,
        JdbcTemplate jdbcTemplate
    ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/me")
    public ApiResponse<WeddingProfileDtos.ProfileResponse> getMyProfile() {
        UserEntity user = currentUser();
        Optional<Long> marriageId = currentMarriageId(user);
        Optional<WeddingProfileEntity> profile = marriageId
            .flatMap(profileRepository::findByMarriageId);
        if (profile.isEmpty() && marriageId.isPresent()) {
            profile = findOwnerProfile(marriageId.get());
        }
        if (profile.isEmpty()) {
            profile = profileRepository.findByUser(user);
        }
        return profile
            .map(resolvedProfile -> ApiResponse.success(
                new WeddingProfileDtos.ProfileResponse(resolvedProfile.getProfileJson(), resolvedProfile.getUpdatedAt())
            ))
            .orElseGet(() -> ApiResponse.success(null));
    }

    @PutMapping("/me")
    public ApiResponse<WeddingProfileDtos.ProfileResponse> saveMyProfile(
        @RequestBody WeddingProfileDtos.SaveRequest request
    ) {
        if (request.profileJson() == null || request.profileJson().trim().isEmpty()) {
            throw new IllegalArgumentException("Wedding profile data is required.");
        }

        UserEntity user = currentUser();
        Optional<Long> marriageId = currentMarriageId(user);
        WeddingProfileEntity profile = marriageId
            .flatMap(profileRepository::findByMarriageId)
            .orElseGet(() -> marriageId
                .flatMap(id -> findOwnerProfile(id).map(existing -> {
                    existing.setMarriageId(id);
                    return existing;
                }))
                .orElseGet(() -> {
                    WeddingProfileEntity created = new WeddingProfileEntity(user, request.profileJson());
                    marriageId.ifPresent(created::setMarriageId);
                    return created;
                }));
        profile.setProfileJson(request.profileJson());
        profile.setUpdatedAt(Instant.now());
        WeddingProfileEntity saved = profileRepository.save(profile);
        return ApiResponse.success(
            new WeddingProfileDtos.ProfileResponse(saved.getProfileJson(), saved.getUpdatedAt())
        );
    }

    private UserEntity currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("User is not authenticated.");
        }
        return userRepository.findByEmail(authentication.getName().toLowerCase())
            .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

    private Optional<Long> currentMarriageId(UserEntity user) {
        Long marriageId = jdbcTemplate.query("""
            SELECT marriage_id FROM marriage_members
            WHERE user_id = ? AND status = 'ACTIVE'
            ORDER BY joined_at DESC LIMIT 1
            """, rs -> rs.next() ? rs.getLong(1) : null, user.getId());
        return Optional.ofNullable(marriageId);
    }

    private Optional<WeddingProfileEntity> findOwnerProfile(Long marriageId) {
        Long ownerId = jdbcTemplate.query("""
            SELECT user_id FROM marriage_members
            WHERE marriage_id = ? AND role = 'OWNER' AND status = 'ACTIVE'
            ORDER BY joined_at DESC LIMIT 1
            """, rs -> rs.next() ? rs.getLong(1) : null, marriageId);
        if (ownerId == null) return Optional.empty();
        return userRepository.findById(ownerId).flatMap(profileRepository::findByUser);
    }
}
