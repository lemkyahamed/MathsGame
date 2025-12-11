<?php

/**
 * db_connect.php

 *
 * DATABASE TABLE (SQL):
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


require_once __DIR__ . '/config/constants.php';


$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";

// PDO options
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, 
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       
    PDO::ATTR_EMULATE_PREPARES   => false,                 
];

try {
    // Create the PDO connection object
    $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, $options);
} catch (PDOException $e) {
   
    http_response_code(500);
    exit(json_encode(['status' => 'error', 'message' => 'Database connection failed.']));
}