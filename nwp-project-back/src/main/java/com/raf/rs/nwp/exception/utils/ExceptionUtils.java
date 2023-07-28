package com.raf.rs.nwp.exception.utils;

import com.raf.rs.nwp.exception.exceptions.ResourceAlreadyExistsException;
import com.raf.rs.nwp.exception.exceptions.ResourceNotFoundException;
import com.raf.rs.nwp.exception.exceptions.TokenExpiredException;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@AllArgsConstructor
public class ExceptionUtils {

    private final MessageSource messageSource;

    public ResourceNotFoundException createResourceNotFoundException(String resourceType, String fieldName, String fieldValue) {
        String message = messageSource.getMessage("error.resource.notfound", new Object[]{resourceType, fieldName, fieldValue}, Locale.getDefault());
        return new ResourceNotFoundException(message);
    }

    public ResourceAlreadyExistsException createResourceAlreadyExistsException(String resourceType, String fieldName, String fieldValue) {
        String message = messageSource.getMessage("error.resource.already.exists", new Object[]{resourceType, fieldName, fieldValue}, Locale.getDefault());
        return new ResourceAlreadyExistsException(message);
    }

    public TokenExpiredException createTokenExpiredException(String token) {
        String message = messageSource.getMessage("error.token.expired", new Object[]{token}, Locale.getDefault());
        return new TokenExpiredException(message);
    }

}