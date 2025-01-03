<?php
// update_cart.php

// Include the database connection
include('db.php');

// Set JSON header
header('Content-Type: application/json');

// Get the data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Get username and cart products
$username = $data['username'];
$product_ids = json_encode($data['product_ids']);

// Check if cart is empty
if (empty($product_ids)) {
    echo json_encode(['status' => 'error', 'error' => 'Empty cart']);
    exit();
}

try {
    // Check if the user already has a cart
    $query = $connection->prepare("SELECT cart_id FROM carts WHERE username = ?");
    $query->execute([$username]);
    $existingCart = $query->fetch(PDO::FETCH_ASSOC);

    if ($existingCart) {
        // Update the existing cart
        $updateQuery = $connection->prepare("UPDATE carts SET product_ids = ? WHERE username = ?");
        $updateQuery->execute([$product_ids, $username]);
        echo json_encode(['status' => 'success']);
    } else {
        // Insert a new cart for the user
        $insertQuery = $connection->prepare("INSERT INTO carts (username, product_ids) VALUES (?, ?)");
        $insertQuery->execute([$username, $product_ids]);
        echo json_encode(['status' => 'success']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'error' => $e->getMessage()]);
}
?>