<?php

/**
 * constants.php
 *
 * Defines application-wide constants, such as database credentials
 * and session/cookie settings.
 *
 * High Cohesion: This file's only job is to define configuration.
 * Low Coupling: Other files read these constants without knowing where
 * they are defined.
 */

// --- Database Credentials ---
// TODO: Replace with your actual database details
define('DB_HOST', 'localhost');
define('DB_NAME', 'math_quiz_db');
define('DB_USER', 'root');
define('DB_PASSWORD', '');

// --- Session & Cookie Settings ---
define('SESSION_NAME', 'MathQuizSession');
define('COOKIE_NAME', 'PLAYER_LOGGED_IN');
define('COOKIE_EXPIRATION', time() + (86400 * 30)); // 30 days