package com.bca6th.project.motorbikebackend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SendOtpRequest (
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email
){}
