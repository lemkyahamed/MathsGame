<?php


header('Content-Type: application/json');


require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/helpers/validation.php';


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonError(405, 'Method Not Allowed.');
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$username = sanitizeInput($input['username'] ?? '');
$email = sanitizeInput($input['email'] ?? '');
$password = $input['password'] ?? ''; 


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
  
    $stmt = $pdo->prepare("SELECT id FROM players WHERE email = ? OR username = ?");
    $stmt->execute([$email, $username]);
    
    if ($stmt->fetch()) {
        sendJsonError(409, 'Email or username already taken.');
    }

    //  Hash Password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

   
    $stmt = $pdo->prepare("INSERT INTO players (username, email, password_hash) VALUES (?, ?, ?)");
    $stmt->execute([$username, $email, $passwordHash]);


    sendJsonSuccess(201, ['message' => 'Account created successfully!']);

} catch (PDOException $e) {
    
    sendJsonError(500, 'Database error: ' . $e->getMessage());
}