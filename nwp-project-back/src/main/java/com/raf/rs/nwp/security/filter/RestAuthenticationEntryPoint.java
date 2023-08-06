package com.raf.rs.nwp.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.raf.rs.nwp.dto.api_response.ApiErrorResponse;
import com.raf.rs.nwp.exception.utils.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.ZonedDateTime;

@Component
@RequiredArgsConstructor
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        ErrorCode errorCode = ErrorCode.PERMISSION_DENIED;

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(
                ZonedDateTime.now(),
                authException.getMessage(),
                errorCode);

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), apiErrorResponse);
    }
}