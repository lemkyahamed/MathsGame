<?php

require_once __DIR__ . '/../backend/config/constants.php';
session_name(SESSION_NAME);
session_start();

// If user is already logged in, redirect to Main Menu immediately
if (isset($_SESSION['user_id'])) {
    header("Location: mainmanu.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Maths Quiz - Login</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
    <link rel="stylesheet" href="login.css">
</head>
<body>
    <div class="stars">
        <div class="star" style="top: 10%; left: 80%; animation-duration: 4s;"></div>
        <div class="star" style="top: 50%; left: 20%; animation-duration: 6s;"></div>
        <div class="star" style="top: 80%; left: 60%; animation-duration: 5s;"></div>
    </div>

    <div class="container">
        <div class="auth-box">
            <div class="logo">🧮</div>
            <div class="title" id="form-title">The Math Challenge</div>
            <div class="subtitle">Timed arithmetic training for a sharper mind.</div>
            
            <div id="auth-notification" class="notification"></div>

            <form id="login-section" class="form-section active">
                <div class="form-group">
                    <label for="login-email" class="label">Email Address</label>
                    <input type="email" id="login-email" class="input-field" placeholder="your@email.com" required>
                </div>
                <div class="form-group">
                    <label for="login-password" class="label">Password</label>
                    <input type="password" id="login-password" class="input-field" placeholder="Enter your password" required>
                </div>
                <button type="submit" id="login-button" class="btn btn-primary">🔑 LOG IN</button>
            </form>

            <form id="signup-section" class="form-section">
                <div class="form-group">
                    <label for="signup-username" class="label">Username</label>
                    <input type="text" id="signup-username" class="input-field" placeholder="Choose a username" required>
                </div>
                <div class="form-group">
                    <label for="signup-email" class="label">Email Address</label>
                    <input type="email" id="signup-email" class="input-field" placeholder="your@email.com" required>
                </div>
                <div class="form-group">
                    <label for="signup-password" class="label">Password</label>
                    <input type="password" id="signup-password" class="input-field" placeholder="Create a strong password" required>
                </div>
                <button type="submit" id="signup-button" class="btn btn-secondary">✍️ SIGN UP</button>
            </form>

            <div class="divider">OR</div>
            
            <div class="toggle-form">
                <p>
                    <span id="toggle-message">New Player?</span> 
                    <a id="toggle-link" class="toggle-link">Create an account</a>
                </p>
            </div>
        </div>
    </div>
    <script src="../javascript/login.js" defer></script>
</body>
</html>