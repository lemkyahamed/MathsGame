<?php

/**
 * validation.php
 *
 * Provides reusable functions for validating and sanitizing user input.
 *
 * High Cohesion: All functions are related to validation/sanitization.
 * Low Coupling: These functions are pure (no side effects) and can be
 * used by any other script.
 */

/**
 * Sanitizes a string for safe use.
 *
 * @param string $data The input string.
 * @return string The sanitized string.
 */
function sanitizeInput(string $data): string
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Validates if a string is a well-formed email address.
 *
 * @param string $email The email to check.
 * @return bool True if valid, false otherwise.
 */
function isValidEmail(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Checks if a password meets minimum strength requirements.
 * (, at least 8 characters)
 *
 * @param string $password The password to check.
 * @return bool True if it meets criteria, false otherwise.
 */
function isStrongPassword(string $password): bool
{
    // Example: at least 8 characters long
    return strlen($password) >= 8;
}

/**
 * Responds with a JSON-encoded error and exits the script.
 *
 * @param int $code The HTTP response code (e.g., 400).
 * @param string $message The error message.
 */
function sendJsonError(int $code, string $message): void
{
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $message]);
    exit;
}

/**
 * Responds with a JSON-encoded success message and exits.
 *
 * @param int $code The HTTP response code (e.g., 200, 201).
 * @param array $data The data to include in the response.
 */
function sendJsonSuccess(int $code, array $data = []): void
{
    http_response_code($code);
    echo json_encode(['status' => 'success', 'data' => $data]);
    exit;
}