<?php
// game.php (Formerly index.html)
require_once __DIR__ . '/backend/config/constants.php';
session_name(SESSION_NAME);
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Maths Game</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
        <link rel="stylesheet" href="game.css">
    </head>
    
    <body>
        <div id="heading">
            <h1>THE MATH CHALLENGE</h1>
        </div>
        
        <div id="container">
            <div id="top-bar">
                 <div id="hearts" class="stat-box" style="display:none;">
                    ❤️ Lives: <span id="heartcount">3</span>
                </div>
                <div id="score" class="stat-box">
                    Score: <span id="scorevalue">0</span>
                </div>
            </div>

            <div id="correct" style="display:none;">Correct ✅</div>
            <div id="wrong" style="display:none;">Try again ❌</div>
            <div id="question"></div>
            <div id="instruction">Click on the correct answer</div>
            
            <div id="choices">
                <div id="box1" class="box"></div>
                <div id="box2" class="box"></div>
                <div id="box3" class="box"></div>
                <div id="box4" class="box"></div>
            </div>
            
            <div id="startreset">Main Menu</div>
            
            <div id="timeremaining" style="display:none;">
                Time remaining: <span id="timeremainingvalue">60</span> sec
            </div>
            
            <div id="gameOver" style="display:none;">
                <button id="closeGameOver" class="close-btn">&times;</button>
                <div id="gameOverContent"></div>
            </div>
        </div>

        <div id="heartChallengeModal" style="display:none;">
            <div id="challengeContent">
                <h2>❤️ Life Saver Challenge! ❤️</h2>
                <p>Answer this puzzle to save your life!</p>
                <img id="challengeImage" src="" alt="Challenge Image">
                <input type="number" id="challengeInput" placeholder="Enter the solution">
                <button id="submitChallenge">Submit Answer</button>
                <p id="challengeMessage"></p>
            </div>
        </div>

        <div id="confirmQuitModal" style="display:none;">
            <div id="confirmQuitContent">
                <h2>Quit Game?</h2>
                <p>Are you sure you want to leave? Your score will be lost.</p>
                <div class="confirm-buttons">
                    <button id="confirmQuitYes" class="btn-quit btn-quit-yes">Yes, Quit</button>
                    <button id="confirmQuitNo" class="btn-quit btn-quit-no">No, Cancel</button>
                </div>
            </div>
        </div>

        <script src="index.js"></script>
    </body>
</html>