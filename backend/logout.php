<?php

/**
 * logout.php
 *
 * Handles player logout.
 * - Destroys the session.
 * - Clears the login cookie.
 *
 * High Cohesion: This script's sole purpose is user session termination.
 */

header('Content-Type: application/json');
require_once __DIR__ . '/config/constants.php';

// --- 1. Start the Session (to access and destroy it) ---
session_name(SESSION_NAME);
session_start();

// --- 2. Unset all session variables ---
$_SESSION = [];

// --- 3. Destroy the Session ---
// This will also delete the session cookie.
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
session_destroy();

// --- 4. Clear the 'Logged In' Cookie ---
// Set its expiration date to the past.
setcookie(COOKIE_NAME, '', time() - 3600, '/', '', isset($_SERVER['HTTPS']), true);

// --- 5. Send Success Response ---
// No need to redirect, the frontend will handle this response.
http_response_code(200);
echo json_encode(['status' => 'success', 'message' => 'Logged out successfully.']);