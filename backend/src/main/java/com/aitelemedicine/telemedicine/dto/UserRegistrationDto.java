package com.aitelemedicine.telemedicine.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserRegistrationDto {
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "First name can only contain letters and spaces")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Last name can only contain letters and spaces")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    private String username;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$", 
             message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    private String password;
    
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(PATIENT|DOCTOR|ADMIN)$", message = "Role must be PATIENT, DOCTOR, or ADMIN")
    private String role;
    
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    @Pattern(regexp = "^[+]?[0-9\\s\\-\\(\\)]+$", message = "Phone number can only contain numbers, spaces, hyphens, parentheses, and plus sign")
    private String phoneNumber;
    
    @Size(max = 100, message = "Specialization must not exceed 100 characters")
    private String specialization;
    
    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;
    
    @Size(max = 200, message = "Address must not exceed 200 characters")
    private String address;
    
    @Size(max = 50, message = "City must not exceed 50 characters")
    private String city;
    
    @Size(max = 50, message = "State must not exceed 50 characters")
    private String state;
    
    @Size(max = 10, message = "Zip code must not exceed 10 characters")
    @Pattern(regexp = "^[0-9\\-]+$", message = "Zip code can only contain numbers and hyphens")
    private String zipCode;
    
    @Size(max = 50, message = "Country must not exceed 50 characters")
    private String country;
    
    @AssertTrue(message = "You must accept the terms and conditions")
    private Boolean acceptTerms = false;
    
    @AssertTrue(message = "You must accept the privacy policy")
    private Boolean acceptPrivacyPolicy = false;
} 