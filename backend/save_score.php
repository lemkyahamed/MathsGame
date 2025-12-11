<?php


header('Content-Type: application/json');
require_once __DIR__ . '/config/constants.php';
require_once __DIR__ . '/db_connect.php';

session_name(SESSION_NAME);
session_start();


if (!isset($_SESSION['user_id'])) {
    http_response_code(401); 
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$score = isset($input['score']) ? intval($input['score']) : 0;
$difficulty = isset($input['difficulty']) ? $input['difficulty'] : 'easy';

$allowed_difficulties = ['easy', 'medium', 'hard'];
if (!in_array($difficulty, $allowed_difficulties)) {
    $difficulty = 'easy';
}

try {
    $stmt = $pdo->prepare("INSERT INTO scores (player_id, score, difficulty) VALUES (?, ?, ?)");
    $stmt->execute([$_SESSION['user_id'], $score, $difficulty]);

    echo json_encode(['status' => 'success', 'message' => 'Score saved']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error']);
}
?>