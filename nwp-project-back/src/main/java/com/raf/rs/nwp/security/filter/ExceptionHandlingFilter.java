package com.raf.rs.nwp.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.raf.rs.nwp.dto.api_response.ApiErrorResponse;
import com.raf.rs.nwp.exception.utils.ErrorCode;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.ZonedDateTime;

@Component
@RequiredArgsConstructor
public class ExceptionHandlingFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (JwtException e) {
            handleException(response, e, ErrorCode.TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
        } catch (BadRequestException e) {
            handleException(response, e, ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            handleException(response, e, ErrorCode.SYSTEM_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void handleException(HttpServletResponse response, Exception e, ErrorCode errorCode, HttpStatus status) throws IOException {
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(ZonedDateTime.now(), e.getMessage(), errorCode);
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), apiErrorResponse);
    }
}