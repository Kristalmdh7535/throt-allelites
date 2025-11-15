//package com.bca6th.project.motorbikebackend.exception;
//
//import io.swagger.v3.oas.annotations.media.Schema;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.Setter;
//import org.springframework.http.*;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//import org.springframework.web.context.request.WebRequest;
//
//import java.time.LocalDateTime;
//import java.util.*;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(BadRequestException.class)
//    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex, WebRequest request) {
//        ErrorResponse error = new ErrorResponse(
//                HttpStatus.BAD_REQUEST.value(),
//                ex.getMessage(),
//                getPath(request),
//                LocalDateTime.now()
//        );
//        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
//    }
//
//    @ExceptionHandler(ResourceNotFoundException.class)
//    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, WebRequest request) {
//        ErrorResponse error = new ErrorResponse(
//                HttpStatus.NOT_FOUND.value(),
//                ex.getMessage(),
//                getPath(request),
//                LocalDateTime.now()
//        );
//        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
//    }
//
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<ValidationErrorResponse> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
//        Map<String, String> errors = new LinkedHashMap<>();
//        ex.getBindingResult().getFieldErrors().forEach(e ->
//                errors.put(e.getField(), e.getDefaultMessage())
//        );
//
//        ValidationErrorResponse error = new ValidationErrorResponse(
//                HttpStatus.BAD_REQUEST.value(),
//                "Validation failed",
//                getPath(request),
//                LocalDateTime.now(),
//                errors
//        );
//        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
//    }
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ErrorResponse> handleAll(Exception ex, WebRequest request) {
//        ErrorResponse error = new ErrorResponse(
//                HttpStatus.INTERNAL_SERVER_ERROR.value(),
//                "Internal server error",
//                getPath(request),
//                LocalDateTime.now()
//        );
//        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//
//    private String getPath(WebRequest request) {
//        return request.getDescription(false).replace("uri=", "");
//    }
//
//    // === SAFE POJOs with @Schema ===
//    @Getter @Setter @AllArgsConstructor
//    @Schema(description = "Standard error response")
//    public static class ErrorResponse {
//        @Schema(description = "HTTP status code", example = "400")
//        private int status;
//        @Schema(description = "Error message", example = "Invalid OTP")
//        private String message;
//        @Schema(description = "Request path", example = "/api/auth/verify-otp")
//        private String path;
//        @Schema(description = "Timestamp", example = "2025-11-12T14:00:00")
//        private LocalDateTime timestamp;
//    }
//
//    @Getter @Setter @AllArgsConstructor
//    @Schema(description = "Validation error response")
//    public static class ValidationErrorResponse {
//        @Schema(description = "HTTP status code", example = "400")
//        private int status;
//        @Schema(description = "Error message", example = "Validation failed")
//        private String message;
//        @Schema(description = "Request path", example = "/api/auth/register")
//        private String path;
//        @Schema(description = "Timestamp", example = "2025-11-12T14:00:00")
//        private LocalDateTime timestamp;
//        @Schema(description = "Field-level errors")
//        private Map<String, String> errors;
//    }
//}