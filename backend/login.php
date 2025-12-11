<?php

/**
 * login.php
 *
 * Handles player login.
 * - Validates input.
 * - Finds user by email.
 * - Verifies password.
 * - Starts a session and sets a cookie on success.
 *
 * High Cohesion: This script's sole purpose is user authentication.
 */

// Set header to return JSON
header('Content-Type: application/json');

// Include dependencies
require_once __DIR__ . '/db_connect.php'; // Provides $pdo
require_once __DIR__ . '/helpers/validation.php'; // Provides helpers
require_once __DIR__ . '/config/constants.php'; // Provides cookie/session constants

// --- 1. Start Session ---
// Configure session cookie parameters
session_set_cookie_params([
    'lifetime' => 0, // Expires when browser closes
    'path' => '/',
    'domain' => '', // Current domain
    'secure' => isset($_SERVER['HTTPS']), // True if on HTTPS
    'httponly' => true, // Prevents client-side script access
    'samesite' => 'Lax'
]);
session_name(SESSION_NAME);
session_start();

// --- 2. Check Request Method ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonError(405, 'Method Not Allowed.');
}

// --- 3. Get and Sanitize Input ---
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$email = sanitizeInput($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    sendJsonError(400, 'Email and password are required.');
}

try {
    // --- 4. Find User by Email ---
    $stmt = $pdo->prepare("SELECT id, username, password_hash FROM players WHERE email = ?");
    $stmt->execute([$email]);
    $player = $stmt->fetch();

    // --- 5. Verify Password ---
    // Use password_verify. It's crucial to check $player first to avoid
    // errors on non-existent users.
    if (!$player || !password_verify($password, $player['password_hash'])) {
        sendJsonError(401, 'Invalid email or password.');
    }

    // --- 6. Regenerate Session ID ---
    // Successful login! Regenerate session ID to prevent session fixation.
    session_regenerate_id(true);

    // --- 7. Store Player Data in Session ---
    // Store only non-sensitive data.
    $_SESSION['user_id'] = $player['id'];
    $_SESSION['username'] = $player['username'];
    $_SESSION['logged_in_at'] = time();

    // --- 8. Set 'Logged In' Cookie ---
    // This is a simple cookie to indicate login status (e.g., for JS).
    // The session is the primary method for secure authentication.
    setcookie(COOKIE_NAME, 'true', COOKIE_EXPIRATION, '/', '', isset($_SERVER['HTTPS']), true);

    // --- 9. Send Success Response ---
    sendJsonSuccess(200, [
        'message' => 'Login successful!',
        'username' => $player['username']
    ]);

} catch (PDOException $e) {
    sendJsonError(500, 'Database error: ' . $e->getMessage());
}