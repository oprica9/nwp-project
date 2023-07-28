package com.raf.rs.nwp.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.raf.rs.nwp.dto.api_response.ApiErrorResponse;
import com.raf.rs.nwp.exception.utils.ErrorCode;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.ZonedDateTime;

@Component
public class ExceptionHandlingFilter extends OncePerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(ExceptionHandlingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
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
        LOGGER.error("Unhandled exception", e);

        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(ZonedDateTime.now(), e.getMessage(), errorCode);
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.writeValue(response.getWriter(), apiErrorResponse);
    }
}