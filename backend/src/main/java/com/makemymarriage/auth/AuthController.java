package com.makemymarriage.auth;

import com.makemymarriage.auth.AuthDtos.LoginRequest;
import com.makemymarriage.auth.AuthDtos.RegisterRequest;
import com.makemymarriage.auth.AuthDtos.UserResponse;
import com.makemymarriage.common.api.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(
        @RequestBody RegisterRequest body,
        HttpServletRequest request
    ) {
        UserResponse user = authService.register(body);
        establishSession(request, SecurityContextHolder.getContext());
        return ApiResponse.success(user);
    }

    @PostMapping("/login")
    public ApiResponse<UserResponse> login(
        @RequestBody LoginRequest body,
        HttpServletRequest request
    ) {
        UserResponse user = authService.login(body);
        establishSession(request, SecurityContextHolder.getContext());
        return ApiResponse.success(user);
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ApiResponse.success("Logged out successfully");
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> me() {
        return ApiResponse.success(authService.getCurrentUser());
    }

    private void establishSession(HttpServletRequest request, SecurityContext context) {
        HttpSession session = request.getSession(true);
        session.setAttribute(
            HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
            context
        );
    }
}
