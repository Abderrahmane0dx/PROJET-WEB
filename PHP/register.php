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

    // Check if the password already exists
    $passwordQuery = $connection->prepare("SELECT password FROM users");
    $passwordQuery->execute();
    $allPasswords = $passwordQuery->fetchAll(PDO::FETCH_COLUMN);

    foreach ($allPasswords as $hashedPassword) {
        if (password_verify($password, $hashedPassword)) {
            echo json_encode(['error' => 'Please choose a more secure password.']);
            exit();
        }
    }

    // Insert the new user
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $insertQuery = $connection->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
    $insertQuery->execute([$username, $hashedPassword, $email]);

    // Start a session for the new user
    $_SESSION['user'] = ['username' => $username];

    echo json_encode([
        'status' => 'success',
        'message' => 'Registration successful',
        'username' => $username,
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
}
exit();
?>
