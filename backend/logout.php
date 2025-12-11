<?php


header('Content-Type: application/json');
require_once __DIR__ . '/config/constants.php';


session_name(SESSION_NAME);
session_start();


$_SESSION = [];

// This will also delete the session cookie.
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
session_destroy();

setcookie(COOKIE_NAME, '', time() - 3600, '/', '', isset($_SERVER['HTTPS']), true);

http_response_code(200);
echo json_encode(['status' => 'success', 'message' => 'Logged out successfully.']);