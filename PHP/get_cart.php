<?php
// Include the database connection
include('db.php');

// Set JSON header
header('Content-Type: application/json');

// Get the username from the request
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];

try {
    // Query to fetch the cart for the user
    $query = $connection->prepare("SELECT product_ids FROM carts WHERE username = ?");
    $query->execute([$username]);
    $cart = $query->fetch(PDO::FETCH_ASSOC);

    if ($cart) {
        // Return the cart product IDs as JSON
        echo json_encode(['status' => 'success', 'product_ids' => json_decode($cart['product_ids'])]);
    } else {
        // No cart found, return an empty array
        echo json_encode(['status' => 'success', 'product_ids' => []]);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
