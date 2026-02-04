package com.bca6th.project.motorbikebackend.service;

import com.bca6th.project.motorbikebackend.model.Otp;
import com.bca6th.project.motorbikebackend.exception.BadRequestException;
import com.bca6th.project.motorbikebackend.repository.OtpRepository;
import com.bca6th.project.motorbikebackend.service.EmailService;
import com.bca6th.project.motorbikebackend.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService{

    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private static final int OTP_LENGTH = 6;

    @Override
    public void generateAndSendOtp(String email) {
        String otp = generateOtp();
        Otp otpEntity = Otp.builder()
                .email(email)
                .code(otp)
                .ttl(300L)
                .build();
        otpRepository.save(otpEntity);
        emailService.sendOtpEmail(email, otp);
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        for(int i=0; i<OTP_LENGTH; i++){
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        return otpRepository.findById(email)
                .map(stored -> {
                    if(stored.getCode().equals(otp)){
                        otpRepository.delete(stored);
                        return true;
                    }
                    return false;
                })
        .orElseThrow(()-> new BadRequestException("Invalid or Expired OTP."));
    };
}
