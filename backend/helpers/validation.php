<?php


function sanitizeInput(string $data): string
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}


function isValidEmail(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}


function isStrongPassword(string $password): bool
{
    // Example: at least 8 characters long
    return strlen($password) >= 8;
}


function sendJsonError(int $code, string $message): void
{
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $message]);
    exit;
}


function sendJsonSuccess(int $code, array $data = []): void
{
    http_response_code($code);
    echo json_encode(['status' => 'success', 'data' => $data]);
    exit;
}