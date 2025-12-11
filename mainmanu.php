<?php
// mainmanu.php (Formerly mainmanu.html)
require_once __DIR__ . '/backend/config/constants.php';
session_name(SESSION_NAME);
session_start();

// Security Check: Redirect to login if not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Maths Quiz - Main Menu</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
    <link rel="stylesheet" href="mainmenu.css">
</head>

<body>
    <div class="minimal-box">
        <div class="minimal-logo">🧮</div>
        <div class="minimal-title">The Math Challenge</div>
        <div class="minimal-subtitle">Welcome, <?php echo htmlspecialchars($_SESSION['username'] ?? 'Player'); ?>!</div>
        
        <button data-modal-target="difficultyModal" class="btn-minimal btn-start-minimal">
            ▶️ START GAME
        </button>

        <div class="minimal-divider">SEE HIGH SCORES</div>

        <button data-modal-target="leaderboardDifficultyModal" class="btn-minimal btn-leaderboard-minimal">
            🏆 GLOBAL LEADERBOARD
        </button>
        
        <div class="minimal-divider">LOGOUT ACCOUNT</div>

        <button id="logout-btn" class="btn-minimal btn-logout-minimal">
            🔒 LOGOUT
        </button>
        
    </div>

    <div id="difficultyModal" class="modal-backdrop">
        <div class="modal-content">
            <button data-modal-close class="modal-close-btn">&times;</button>
            <div class="modal-title">Choose Difficulty</div>
            <a href="game.php?difficulty=easy" class="btn-difficulty btn-easy">Easy (60 Sec)</a>
            <a href="game.php?difficulty=medium" class="btn-difficulty btn-medium">Medium (90 Sec)</a>
            <a href="game.php?difficulty=hard" class="btn-difficulty btn-hard">Hard (120 Sec)</a>
        </div>
    </div>

    <div id="leaderboardDifficultyModal" class="modal-backdrop">
        <div class="modal-content">
            <button data-modal-close class="modal-close-btn">&times;</button>
            <div class="modal-title">View Leaderboard</div>
            <a href="leaderboard.php?difficulty=easy" class="btn-difficulty btn-easy">Easy Scores</a>
            <a href="leaderboard.php?difficulty=medium" class="btn-difficulty btn-medium">Medium Scores</a>
            <a href="leaderboard.php?difficulty=hard" class="btn-difficulty btn-hard">Hard Scores</a>
        </div>
    </div>

    <script src="mainmenu.js" defer></script>
</body>
</html>