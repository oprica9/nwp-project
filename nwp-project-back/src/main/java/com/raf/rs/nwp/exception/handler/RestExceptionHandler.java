package com.raf.rs.nwp.exception.handler;

import com.raf.rs.nwp.dto.api_response.ApiErrorResponse;
import com.raf.rs.nwp.exception.exceptions.MachineException;
import com.raf.rs.nwp.exception.exceptions.ResourceAlreadyExistsException;
import com.raf.rs.nwp.exception.exceptions.ResourceNotFoundException;
import com.raf.rs.nwp.exception.utils.ErrorCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.stream.Collectors;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(RestExceptionHandler.class);

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String errorMessages = ex.getBindingResult().getFieldErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage).collect(Collectors.joining(", "));

        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(
                ZonedDateTime.now(),
                errorMessages,
                ErrorCode.VALIDATION_FAILED);

        return new ResponseEntity<>(apiErrorResponse, HttpStatus.BAD_REQUEST);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(
                ZonedDateTime.now(),
                "Failed to read request: " + ex.getMessage(),
                ErrorCode.BAD_REQUEST
        );
        return new ResponseEntity<>(apiErrorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    protected ResponseEntity<ApiErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(
                ZonedDateTime.now(),
                ex.getMessage(),
                ErrorCode.RESOURCE_NOT_FOUND);
        return new ResponseEntity<>(apiErrorResponse, HttpStatus.NOT_FOUND);

    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    protected ResponseEntity<ApiErrorResponse> handleResourceAlreadyExistsException(ResourceAlreadyExistsException ex) {
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(
                ZonedDateTime.now(),
                ex.getMessage(),
                ErrorCode.RESOURCE_ALREADY_EXISTS);
        return new ResponseEntity<>(apiErrorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(MachineException.class)
    protected ResponseEntity<ApiErrorResponse> handleMachineStatusException(MachineException ex) {
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(
                ZonedDateTime.now(),
                ex.getMessage(),
                ErrorCode.MACHINE_ERROR);
        return new ResponseEntity<>(apiErrorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleAllExceptions(Exception e) {
        LOGGER.error(e.toString());
        LOGGER.error(Arrays.toString(e.getStackTrace()));
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(
                ZonedDateTime.now(),
                "An unexpected error occurred.",
                ErrorCode.SYSTEM_ERROR);
        return new ResponseEntity<>(apiErrorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}