<?php


  //High Cohesion: This script's sole purpose is user authentication.
 


header('Content-Type: application/json');

require_once __DIR__ . '/db_connect.php'; 
require_once __DIR__ . '/helpers/validation.php'; 
require_once __DIR__ . '/config/constants.php'; 


session_set_cookie_params([
    'lifetime' => 0, 
    'path' => '/',
    'domain' => '', 
    'secure' => isset($_SERVER['HTTPS']), 
    'httponly' => true, 
    'samesite' => 'Lax'
]);
session_name(SESSION_NAME);
session_start();


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonError(405, 'Method Not Allowed.');
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$email = sanitizeInput($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    sendJsonError(400, 'Email and password are required.');
}

try {
    
    $stmt = $pdo->prepare("SELECT id, username, password_hash FROM players WHERE email = ?");
    $stmt->execute([$email]);
    $player = $stmt->fetch();

 
    if (!$player || !password_verify($password, $player['password_hash'])) {
        sendJsonError(401, 'Invalid email or password.');
    }

    // Regenerate Session ID 
    session_regenerate_id(true);


    $_SESSION['user_id'] = $player['id'];
    $_SESSION['username'] = $player['username'];
    $_SESSION['logged_in_at'] = time();

   
    setcookie(COOKIE_NAME, 'true', COOKIE_EXPIRATION, '/', '', isset($_SERVER['HTTPS']), true);

    
    sendJsonSuccess(200, [
        'message' => 'Login successful!',
        'username' => $player['username']
    ]);

} catch (PDOException $e) {
    sendJsonError(500, 'Database error: ' . $e->getMessage());
}