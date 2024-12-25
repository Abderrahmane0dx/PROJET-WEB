<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'db.php';  // Include the db.php file

// Allow CORS for testing purposes (remove in production)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Get data from the client
$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'];
$password = $data['password'];

// Query to check if the user exists
$sql = "SELECT * FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Check if the password matches
    if (password_verify($password, $user['password'])) {
        // Start session and save the username in session
        $_SESSION['username'] = $user['username'];  // Save the username in the session
        
        // Optional: Set a cookie for remembering the user (for a week)
        setcookie('username', $user['username'], time() + (7 * 24 * 60 * 60), "/");  // Cookie lasts for a week
        
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Incorrect password."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User does not exist."]);
}



// Close connection
$conn->close();
?>
