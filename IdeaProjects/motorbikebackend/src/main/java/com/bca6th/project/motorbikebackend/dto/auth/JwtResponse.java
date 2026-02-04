package com.bca6th.project.motorbikebackend.dto.auth;

public record JwtResponse(
        String token,
        String bearer,
        Long id,
        String name,
        String email,
        String role
) {
    public String type() {
        return "Bearer";
    }
}
