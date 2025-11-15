package com.bca6th.project.motorbikebackend.service;

import com.bca6th.project.motorbikebackend.dto.auth.JwtResponse;
import com.bca6th.project.motorbikebackend.dto.auth.RegisterRequest;
import com.bca6th.project.motorbikebackend.dto.auth.VerifyOtpRequest;

public interface AuthService {
    void register(RegisterRequest request);
    JwtResponse loginWithOtp(VerifyOtpRequest request);
}
