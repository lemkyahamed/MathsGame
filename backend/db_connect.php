<?php

/**
 * db_connect.php

 *
 * REQUIRED DATABASE TABLE (SQL):
 *
 * CREATE TABLE players (
 * id INT AUTO_INCREMENT PRIMARY KEY,
 * username VARCHAR(50) NOT NULL UNIQUE,
 * email VARCHAR(100) NOT NULL UNIQUE,
 * password_hash VARCHAR(255) NOT NULL,
 * created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 *
 */

// Include configuration
require_once __DIR__ . '/config/constants.php';

// Database Source Name (DSN)
$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";

// PDO options
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on error
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Fetch associative arrays
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Use native prepared statements
];

try {
    // Create the PDO connection object
    $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, $options);
} catch (PDOException $e) {
    // Stop the script and show a generic error.
    // In production, you would log this error and show a user-friendly page.
    http_response_code(500);
    exit(json_encode(['status' => 'error', 'message' => 'Database connection failed.']));
}