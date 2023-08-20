package com.raf.rs.nwp.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.raf.rs.nwp.dto.api_response.ApiResponse;
import com.raf.rs.nwp.dto.auth.AuthenticationResponseDTO;
import com.raf.rs.nwp.dto.auth.LoginRequest;
import com.raf.rs.nwp.security.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.BadRequestException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.time.ZonedDateTime;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final ObjectMapper objectMapper;

    public JWTAuthenticationFilter(JwtUtils jwtUtils, AuthenticationManager authenticationManager, ObjectMapper objectMapper) {
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.setFilterProcessesUrl("/auth/login");
        this.objectMapper = objectMapper;
        this.setAuthenticationFailureHandler(new CustomAuthenticationFailureHandler(objectMapper));
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res)
            throws AuthenticationException {
        try {
            LoginRequest loginRequest = objectMapper.readValue(req.getInputStream(), LoginRequest.class);

            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
        }
        catch (IOException e) {
            throw new BadRequestException("Invalid login request format.");
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication auth) throws IOException {
        String token = jwtUtils.generateJwtToken(auth);

        AuthenticationResponseDTO responseDTO = new AuthenticationResponseDTO(token);
        ApiResponse<AuthenticationResponseDTO> response = new ApiResponse<>(ZonedDateTime.now(), "success", responseDTO);
        String responseBody = objectMapper.writeValueAsString(response);

        res.getWriter().write(responseBody);
        res.getWriter().flush();
        res.getWriter().close();
    }
}
