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
    //La Requete SQL Pour Récuperer De La Base De Données:
    $query = $connection->prepare("SELECT username, password FROM users WHERE username = ?");
    $query->execute([$username]);
    $user = $query->fetch(PDO::FETCH_ASSOC);

    //Si L'Utilisateur Exist:
    if ($user) {
        //Verification du mot de passe:
        if (password_verify($password, $user['password'])) {
            $_SESSION['user'] = ['username' => $user['username']];
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Login successful',
                'username' => $user['username'],
            ]);
        } else {
            echo json_encode(['error' => 'Invalid password']);
        }
    } else {
        echo json_encode(['error' => 'Invalid username']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
}
exit();
?>
