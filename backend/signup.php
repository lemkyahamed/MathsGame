<?php

/**
 * signup.php
 *
 * Handles new player registration.
 * - Validates input.
 * - Checks for existing user.
 * - Hashes password.
 * - Creates new user in the database.
 *
 * High Cohesion: This script's sole purpose is user registration.
 */

// Set header to return JSON
header('Content-Type: application/json');

// Include dependencies
require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/helpers/validation.php';

// --- 1. Check Request Method ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonError(405, 'Method Not Allowed.');
}

// --- 2. Get and Sanitize Input ---
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$username = sanitizeInput($input['username'] ?? '');
$email = sanitizeInput($input['email'] ?? '');
$password = $input['password'] ?? ''; // htmlspecialchars password

// --- 3. Validate Input ---
if (empty($username) || empty($email) || empty($password)) {
    sendJsonError(400, 'All fields are required.');
}
if (!isValidEmail($email)) {
    sendJsonError(400, 'Invalid email format.');
}
if (!isStrongPassword($password)) {
    sendJsonError(400, 'Password must be at least 8 characters long.');
}

try {
    // --- 4. Check for Existing User ---
    $stmt = $pdo->prepare("SELECT id FROM players WHERE email = ? OR username = ?");
    $stmt->execute([$email, $username]);
    
    if ($stmt->fetch()) {
        sendJsonError(409, 'Email or username already taken.');
    }

    // --- 5. Hash Password ---
    // PASSWORD_DEFAULT uses the strongest available algorithm
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // --- 6. Insert New User ---
    $stmt = $pdo->prepare("INSERT INTO players (username, email, password_hash) VALUES (?, ?, ?)");
    $stmt->execute([$username, $email, $passwordHash]);

    // --- 7. Send Success Response ---
    sendJsonSuccess(201, ['message' => 'Account created successfully!']);

} catch (PDOException $e) {
    // Handle potential database errors (e.g., unique constraint violation)
    sendJsonError(500, 'Database error: ' . $e->getMessage());
}