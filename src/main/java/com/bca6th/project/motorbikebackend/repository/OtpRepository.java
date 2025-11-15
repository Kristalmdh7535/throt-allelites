package com.bca6th.project.motorbikebackend.repository;

import com.bca6th.project.motorbikebackend.model.Otp;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpRepository extends CrudRepository <Otp, String> {
}
