package com.makemymarriage.profile;

import com.makemymarriage.auth.UserEntity;
import com.makemymarriage.auth.UserRepository;
import com.makemymarriage.common.api.ApiResponse;
import java.time.Instant;
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

    public WeddingProfileController(
        UserRepository userRepository,
        WeddingProfileRepository profileRepository
    ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @GetMapping("/me")
    public ApiResponse<WeddingProfileDtos.ProfileResponse> getMyProfile() {
        UserEntity user = currentUser();
        return profileRepository.findByUser(user)
            .map(profile -> ApiResponse.success(
                new WeddingProfileDtos.ProfileResponse(profile.getProfileJson(), profile.getUpdatedAt())
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
        WeddingProfileEntity profile = profileRepository.findByUser(user)
            .orElse(new WeddingProfileEntity(user, request.profileJson()));
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
}
