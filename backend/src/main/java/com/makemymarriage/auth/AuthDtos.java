package com.makemymarriage.auth;

public class AuthDtos {

    public record RegisterRequest(
        String firstName,
        String lastName,
        String email,
        String password
    ) {
    }

    public record LoginRequest(
        String email,
        String password
    ) {
    }

    public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String email
    ) {
    }
}
