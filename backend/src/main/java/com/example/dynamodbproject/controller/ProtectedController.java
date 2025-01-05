package com.example.dynamodbproject.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ProtectedController {

    // Protected endpoint that requires JWT authentication
    @GetMapping("/protected-endpoint")
    public String protectedEndpoint(Authentication authentication) {
        // Extract user information from the SecurityContext
        String email = authentication.getName(); // The subject from the JWT
        return "Hello, " + email + "! This is a protected endpoint.";
    }
}
