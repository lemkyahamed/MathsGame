<?php
/**
 * get_leaderboard.php
 * Returns top 10 scores for a specific difficulty.
 */

header('Content-Type: application/json');
require_once __DIR__ . '/config/constants.php';
require_once __DIR__ . '/db_connect.php';

$difficulty = $_GET['difficulty'] ?? 'easy';

// Validate difficulty to prevent SQL injection via unexpected strings
$allowed = ['easy', 'medium', 'hard'];
if (!in_array($difficulty, $allowed)) {
    $difficulty = 'easy';
}

try {
    // Join players table to get usernames associated with scores
    $sql = "SELECT p.username, s.score 
            FROM scores s 
            JOIN players p ON s.player_id = p.id 
            WHERE s.difficulty = ? 
            ORDER BY s.score DESC 
            LIMIT 10";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$difficulty]);
    $scores = $stmt->fetchAll();

    // Add Rank to the data
    $rankedScores = [];
    $rank = 1;
    foreach ($scores as $row) {
        $rankedScores[] = [
            'rank' => $rank++,
            'player' => htmlspecialchars($row['username']), // Sanitize output
            'score' => $row['score']
        ];
    }

    echo json_encode(['status' => 'success', 'data' => $rankedScores]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>