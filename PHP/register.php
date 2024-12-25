<?php
// register.php

// Include the database connection file
require_once 'db.php';  // Include the db.php file

// Start a session
session_start();

// Allow CORS for testing purposes (remove in production)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Get data from the client
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$username = $data['username'];
$password = $data['password'];

// Hash the password for security
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Check if username or email already exists
$sql_check = "SELECT * FROM users WHERE username = ? OR email = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("ss", $username, $email);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Username or Email already exists."]);
} else {
    // Insert the user into the database
    $sql_insert = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
    $stmt_insert = $conn->prepare($sql_insert);
    $stmt_insert->bind_param("sss", $email, $username, $hashed_password);
    
    if ($stmt_insert->execute()) {
        // Get the last inserted ID
        $user_id = $stmt_insert->insert_id;

        // Set session variables
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $username;

        // Set cookies for 30 days
        setcookie('user_id', $user_id, time() + (30 * 24 * 60 * 60), '/');  // Expires in 30 days
        setcookie('username', $username, time() + (30 * 24 * 60 * 60), '/');

        echo json_encode(["success" => true, "message" => "Account created successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to create account."]);
    }
}

// Close the database connection
$conn->close();
?>
