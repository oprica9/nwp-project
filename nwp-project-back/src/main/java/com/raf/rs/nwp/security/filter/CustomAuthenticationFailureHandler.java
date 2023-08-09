package com.raf.rs.nwp.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.raf.rs.nwp.dto.api_response.ApiErrorResponse;
import com.raf.rs.nwp.exception.utils.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import java.io.IOException;
import java.time.ZonedDateTime;

@RequiredArgsConstructor
public class CustomAuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private final ObjectMapper objectMapper;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException e) throws IOException, ServletException {
        if (e instanceof BadCredentialsException) {
            ApiErrorResponse apiErrorResponse = new ApiErrorResponse(ZonedDateTime.now(), e.getMessage(), ErrorCode.INVALID_CREDENTIALS);
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(response.getWriter(), apiErrorResponse);
        } else {
            super.onAuthenticationFailure(request, response, e);
        }
    }
}