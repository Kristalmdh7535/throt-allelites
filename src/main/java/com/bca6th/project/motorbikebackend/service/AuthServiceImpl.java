package com.bca6th.project.motorbikebackend.service;

import com.bca6th.project.motorbikebackend.dto.auth.JwtResponse;
import com.bca6th.project.motorbikebackend.dto.auth.RegisterRequest;
import com.bca6th.project.motorbikebackend.dto.auth.VerifyOtpRequest;
import com.bca6th.project.motorbikebackend.exception.BadRequestException;
import com.bca6th.project.motorbikebackend.model.Role;
import com.bca6th.project.motorbikebackend.model.User;
import com.bca6th.project.motorbikebackend.repository.UserRepository;
import com.bca6th.project.motorbikebackend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtUtils jwtUtils;

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .contactNo(request.contactNo())
                .role(Role.USER)
                .build();

        userRepository.save(user);
        // Send OTP after registration
        otpService.generateAndSendOtp(request.email());
    }


    @Override
    public JwtResponse loginWithOtp(VerifyOtpRequest request) {
        if (!otpService.verifyOtp(request.email(), request.otp())) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadRequestException("User not found"));

        // ← CORRECT: uses generateToken(User)
        String jwt = jwtUtils.generateToken(user);

        return new JwtResponse(
                jwt,
                "Bearer",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
