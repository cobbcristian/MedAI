package com.aitelemedicine.telemedicine.security;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private final Map<String, LoginAttempt> loginAttempts = new ConcurrentHashMap<>();
    private final Map<String, ApiRequest> apiRequests = new ConcurrentHashMap<>();

    // Rate limiting configuration
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOGIN_LOCKOUT_MINUTES = 15;
    private static final int MAX_API_REQUESTS_PER_MINUTE = 100;
    private static final int API_RATE_LIMIT_WINDOW_MINUTES = 1;

    public boolean isLoginAllowed(String username) {
        LoginAttempt attempt = loginAttempts.get(username);
        
        if (attempt == null) {
            return true;
        }

        // Check if lockout period has expired
        if (attempt.getLastAttemptTime().plusMinutes(LOGIN_LOCKOUT_MINUTES).isBefore(LocalDateTime.now())) {
            loginAttempts.remove(username);
            return true;
        }

        // Check if max attempts exceeded
        return attempt.getAttemptCount() < MAX_LOGIN_ATTEMPTS;
    }

    public void recordLoginAttempt(String username, boolean success) {
        LoginAttempt attempt = loginAttempts.get(username);
        
        if (attempt == null) {
            attempt = new LoginAttempt();
            attempt.setUsername(username);
        }

        if (success) {
            // Reset on successful login
            loginAttempts.remove(username);
        } else {
            // Increment failed attempt
            attempt.setAttemptCount(attempt.getAttemptCount() + 1);
            attempt.setLastAttemptTime(LocalDateTime.now());
            loginAttempts.put(username, attempt);
        }
    }

    public boolean isApiRequestAllowed(String clientId) {
        ApiRequest request = apiRequests.get(clientId);
        
        if (request == null) {
            return true;
        }

        // Check if rate limit window has expired
        if (request.getWindowStart().plusMinutes(API_RATE_LIMIT_WINDOW_MINUTES).isBefore(LocalDateTime.now())) {
            apiRequests.remove(clientId);
            return true;
        }

        // Check if max requests exceeded
        return request.getRequestCount() < MAX_API_REQUESTS_PER_MINUTE;
    }

    public void recordApiRequest(String clientId) {
        ApiRequest request = apiRequests.get(clientId);
        
        if (request == null) {
            request = new ApiRequest();
            request.setClientId(clientId);
            request.setWindowStart(LocalDateTime.now());
        }

        request.setRequestCount(request.getRequestCount() + 1);
        apiRequests.put(clientId, request);
    }

    public int getRemainingLoginAttempts(String username) {
        LoginAttempt attempt = loginAttempts.get(username);
        if (attempt == null) {
            return MAX_LOGIN_ATTEMPTS;
        }
        return Math.max(0, MAX_LOGIN_ATTEMPTS - attempt.getAttemptCount());
    }

    public LocalDateTime getLoginLockoutExpiry(String username) {
        LoginAttempt attempt = loginAttempts.get(username);
        if (attempt == null) {
            return null;
        }
        return attempt.getLastAttemptTime().plusMinutes(LOGIN_LOCKOUT_MINUTES);
    }

    public void clearLoginAttempts(String username) {
        loginAttempts.remove(username);
    }

    public void clearApiRequests(String clientId) {
        apiRequests.remove(clientId);
    }

    // Cleanup expired entries periodically
    public void cleanupExpiredEntries() {
        LocalDateTime now = LocalDateTime.now();
        
        // Cleanup expired login attempts
        loginAttempts.entrySet().removeIf(entry -> 
            entry.getValue().getLastAttemptTime().plusMinutes(LOGIN_LOCKOUT_MINUTES).isBefore(now));
        
        // Cleanup expired API requests
        apiRequests.entrySet().removeIf(entry -> 
            entry.getValue().getWindowStart().plusMinutes(API_RATE_LIMIT_WINDOW_MINUTES).isBefore(now));
    }

    private static class LoginAttempt {
        private String username;
        private int attemptCount;
        private LocalDateTime lastAttemptTime;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public int getAttemptCount() { return attemptCount; }
        public void setAttemptCount(int attemptCount) { this.attemptCount = attemptCount; }
        public LocalDateTime getLastAttemptTime() { return lastAttemptTime; }
        public void setLastAttemptTime(LocalDateTime lastAttemptTime) { this.lastAttemptTime = lastAttemptTime; }
    }

    private static class ApiRequest {
        private String clientId;
        private int requestCount;
        private LocalDateTime windowStart;

        public String getClientId() { return clientId; }
        public void setClientId(String clientId) { this.clientId = clientId; }
        public int getRequestCount() { return requestCount; }
        public void setRequestCount(int requestCount) { this.requestCount = requestCount; }
        public LocalDateTime getWindowStart() { return windowStart; }
        public void setWindowStart(LocalDateTime windowStart) { this.windowStart = windowStart; }
    }
} 