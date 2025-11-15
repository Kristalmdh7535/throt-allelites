package com.bca6th.project.motorbikebackend.controller;

import com.bca6th.project.motorbikebackend.dto.auth.JwtResponse;
import com.bca6th.project.motorbikebackend.dto.auth.RegisterRequest;
import com.bca6th.project.motorbikebackend.dto.auth.SendOtpRequest;
import com.bca6th.project.motorbikebackend.dto.auth.VerifyOtpRequest;
import com.bca6th.project.motorbikebackend.service.AuthService;
import com.bca6th.project.motorbikebackend.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request){
        authService.register(request);
        return ResponseEntity.ok("Registration successfully. OTP sent to email.");
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@Valid @RequestBody SendOtpRequest request){
        otpService.generateAndSendOtp(request.email());
        return ResponseEntity.ok("OTP sent to email.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<JwtResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request){
        JwtResponse response = authService.loginWithOtp(request);
        return ResponseEntity.ok(response);
    }
}
