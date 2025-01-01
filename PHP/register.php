<?php
// Include the database connection
include('db.php');
header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Only POST requests are allowed']);
    http_response_code(405);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if ($data === null) {
    echo json_encode(['error' => 'Invalid JSON received']);
    exit();
}

// Extract fields
$username = $data['username'];
$password = $data['password'];
$email = $data['email'];

if (empty($username) || empty($password) || empty($email)) {
    echo json_encode(['error' => 'All fields are required']);
    exit();
}

try {
    // Check if the username already exists
    $query = $connection->prepare("SELECT username FROM users WHERE username = ?");
    $query->execute([$username]);
    if ($query->fetch()) {
        echo json_encode(['error' => 'Username already exists']);
        exit();
    }

    // Insert the new user into the `users` table
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $insertQuery = $connection->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
    $insertQuery->execute([$username, $hashedPassword, $email]);

    // Get the user ID of the newly inserted user (to use for the wishlist)
    $userId = $connection->lastInsertId();

    // Insert an empty wishlist for the user into the `user_wishlists` table
    $wishlistQuery = $connection->prepare("INSERT INTO user_wishlists (username, wishlist) VALUES (?, ?)");
    $wishlistQuery->execute([$username, json_encode([])]); // Empty wishlist

    // Start a session for the new user
    $_SESSION['user'] = ['username' => $username];

    // Respond with success
    echo json_encode([
        'status' => 'success',
        'message' => 'Registration successful',
        'username' => $username,
    ]);
} catch (PDOException $e) {
    // Handle database error
    echo json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
}
exit();
?>
