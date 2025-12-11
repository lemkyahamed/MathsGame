<?php
require_once __DIR__ . '/../backend/config/constants.php';
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
    <title>Maths Challenge - Leaderboard</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
    <link rel="stylesheet" href="leaderboard.css">
</head>

<body>
    <div class="minimal-box">
        <div class="leaderboard-logo">🏆</div>
        <div class="leaderboard-title">Global Leaderboard</div>
        <div class="leaderboard-subtitle" id="leaderboard-difficulty-subtitle">Loading ranks...</div>

        <div class="leaderboard-container">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody id="leaderboard-body"></tbody>
            </table>
        </div>
        
        <button onclick="window.location.href='mainmanu.php'" class="btn-minimal btn-back-minimal">
            ⬅️ Back to Menu
        </button>
    </div>
    
    <script>
     
        document.addEventListener('DOMContentLoaded', function() {
            const subtitle = document.getElementById('leaderboard-difficulty-subtitle');
            const tableBody = document.getElementById('leaderboard-body');
            const urlParams = new URLSearchParams(window.location.search);
            const difficulty = urlParams.get('difficulty') || 'easy';

            let difficultyTitle = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
            subtitle.textContent = `${difficultyTitle} Difficulty`;

            if (difficulty === 'easy') subtitle.style.color = '#2ecc71';
            else if (difficulty === 'medium') subtitle.style.color = '#f39c12';
            else if (difficulty === 'hard') subtitle.style.color = '#e74c3c';

            tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Loading scores...</td></tr>';

            fetch(`../backend/get_leaderboard.php?difficulty=${difficulty}`)
                .then(response => response.json())
                .then(data => {
                    tableBody.innerHTML = '';
                    if (data.status === 'success' && data.data.length > 0) {
                        data.data.forEach(row => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `<td>${row.rank}</td><td>${row.player}</td><td>${row.score}</td>`;
                            tableBody.appendChild(tr);
                        });
                    } else {
                        tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No scores yet!</td></tr>';
                    }
                })
                .catch(err => {
                    tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Error loading leaderboard.</td></tr>';
                });
        });
    </script>
</body>
</html>