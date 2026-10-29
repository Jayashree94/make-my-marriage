package com.makemymarriage.auth;

import com.makemymarriage.auth.AuthDtos.LoginRequest;
import com.makemymarriage.auth.AuthDtos.RegisterRequest;
import com.makemymarriage.auth.AuthDtos.UserResponse;
import java.util.Objects;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String firstName = sanitize(request.firstName());
        String lastName = sanitize(request.lastName());
        String email = sanitize(request.email()).toLowerCase();
        String rawPassword = request.password();

        if (firstName.isBlank() || lastName.isBlank()) {
            throw new IllegalArgumentException("First name and last name are required.");
        }
        if (email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("A valid email address is required.");
        }
        if (rawPassword == null || rawPassword.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("A user already exists with this email.");
        }

        UserEntity user = new UserEntity(firstName, lastName, email, passwordEncoder.encode(rawPassword));
        UserEntity saved = userRepository.save(user);
        return toUserResponse(saved);
    }

    public UserResponse login(LoginRequest request) {
        String email = sanitize(request.email()).toLowerCase();
        String password = Objects.requireNonNullElse(request.password(), "");

        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

            UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Incorrect email or password."));

            return toUserResponse(user);
        } catch (AuthenticationException ex) {
            throw new IllegalArgumentException("Incorrect email or password.", ex);
        }
    }

    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName() == null) {
            throw new IllegalArgumentException("User is not authenticated.");
        }

        String email = authentication.getName();
        UserEntity user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found."));

        return toUserResponse(user);
    }

    private UserResponse toUserResponse(UserEntity user) {
        return new UserResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail());
    }

    private String sanitize(String value) {
        return value == null ? "" : value.trim();
    }
}
