<?php


define('DB_HOST', 'localhost');
define('DB_NAME', 'math_quiz_db');
define('DB_USER', 'root');
define('DB_PASSWORD', '');

// --- Session & Cookie Settings ---
define('SESSION_NAME', 'MathQuizSession');
define('COOKIE_NAME', 'PLAYER_LOGGED_IN');
define('COOKIE_EXPIRATION', time() + (86400 * 30)); // 30 days