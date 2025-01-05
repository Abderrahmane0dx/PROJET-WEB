<?php 
//Appel à la connection de la base de données:
include('db.php');
//Le Header de JSON:
header('Content-Type: application/json');
//Starting A Session:
session_start();

//Post Request:
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Only POST requests are allowed']);
    http_response_code(405);
    exit();
}

//Getting The Data:
$data = json_decode(file_get_contents('php://input'), true);

if ($data === null) {
    echo json_encode(['error' => 'Invalid JSON received']);
    exit();
}

//Getting The UserName And The PassWord:
$username = $data['username'];
$password = $data['password'];

try {
    // Fetch user details from the database
    $query = $connection->prepare("SELECT username, password FROM users WHERE username = ?");
    $query->execute([$username]);
    $user = $query->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Special case for the admin
        if ($user['username'] === 'admin') {
            // Hash the input password using SHA2 and the same salt
            $hashedAdminPassword = hash('sha256', 'salt' . $password); // Replicates SHA2(CONCAT('salt', password), 256)

            if ($hashedAdminPassword === $user['password']) {
                // Admin login successful
                $_SESSION['user'] = ['username' => $user['username']];
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Admin login successful',
                    'username' => $user['username'],
                    'redirect' => 'admin'
                ]);
            } else {
                echo json_encode(['error' => 'Invalid password']);
            }
        } else {
            // Regular user password verification
            if (password_verify($password, $user['password'])) {
                // User login successful
                $_SESSION['user'] = ['username' => $user['username']];
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Login successful',
                    'username' => $user['username'],
                    'redirect' => 'user'
                ]);
            } else {
                echo json_encode(['error' => 'Invalid password']);
            }
        }
    } else {
        echo json_encode(['error' => 'Invalid username']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
}
exit();
?>
