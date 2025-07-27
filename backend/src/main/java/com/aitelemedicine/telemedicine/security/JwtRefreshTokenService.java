package com.aitelemedicine.telemedicine.security;

import com.aitelemedicine.telemedicine.model.User;
import com.aitelemedicine.telemedicine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtRefreshTokenService {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.jwt.refresh-expiration}")
    private long refreshExpiration;

    // In production, use Redis or database for token storage
    private final Map<String, RefreshTokenInfo> refreshTokenStore = new HashMap<>();

    public String generateRefreshToken(String username) {
        String refreshToken = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusSeconds(refreshExpiration / 1000);
        
        RefreshTokenInfo tokenInfo = new RefreshTokenInfo();
        tokenInfo.setUsername(username);
        tokenInfo.setExpiry(expiry);
        tokenInfo.setRevoked(false);
        
        refreshTokenStore.put(refreshToken, tokenInfo);
        
        return refreshToken;
    }

    public boolean validateRefreshToken(String refreshToken) {
        RefreshTokenInfo tokenInfo = refreshTokenStore.get(refreshToken);
        
        if (tokenInfo == null) {
            return false;
        }
        
        if (tokenInfo.isRevoked()) {
            return false;
        }
        
        if (tokenInfo.getExpiry().isBefore(LocalDateTime.now())) {
            refreshTokenStore.remove(refreshToken);
            return false;
        }
        
        return true;
    }

    public String getUsernameFromRefreshToken(String refreshToken) {
        RefreshTokenInfo tokenInfo = refreshTokenStore.get(refreshToken);
        return tokenInfo != null ? tokenInfo.getUsername() : null;
    }

    public void revokeRefreshToken(String refreshToken) {
        RefreshTokenInfo tokenInfo = refreshTokenStore.get(refreshToken);
        if (tokenInfo != null) {
            tokenInfo.setRevoked(true);
        }
    }

    public void revokeAllUserTokens(String username) {
        refreshTokenStore.entrySet().removeIf(entry -> 
            entry.getValue().getUsername().equals(username));
    }

    public Map<String, Object> refreshAccessToken(String refreshToken) {
        if (!validateRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String username = getUsernameFromRefreshToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = tokenProvider.generateTokenFromUsername(username);
        String newRefreshToken = generateRefreshToken(username);

        // Revoke old refresh token
        revokeRefreshToken(refreshToken);

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", newAccessToken);
        response.put("refreshToken", newRefreshToken);
        response.put("tokenType", "Bearer");
        response.put("expiresIn", 3600);

        return response;
    }

    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        refreshTokenStore.entrySet().removeIf(entry -> 
            entry.getValue().getExpiry().isBefore(now));
    }

    private static class RefreshTokenInfo {
        private String username;
        private LocalDateTime expiry;
        private boolean revoked;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public LocalDateTime getExpiry() { return expiry; }
        public void setExpiry(LocalDateTime expiry) { this.expiry = expiry; }
        public boolean isRevoked() { return revoked; }
        public void setRevoked(boolean revoked) { this.revoked = revoked; }
    }
} 