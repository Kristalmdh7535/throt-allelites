package com.bca6th.project.motorbikebackend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


public record RegisterRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        @NotBlank @Size(min=6) String password,
        @NotBlank @Pattern(regexp = "\\d{10}", message = "Contact number must be exactly 10 digits") String contactNo
) { }
