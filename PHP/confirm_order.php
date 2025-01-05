<?php
// confirm_order.php

include('db.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$username = $data['username'];
$cart = $data['cart'];
$total_price = $data['total_price'];
$delivery_address = $data['delivery_address'];

// Check for required fields
if (empty($username) || empty($cart) || empty($total_price) || empty($delivery_address)) {
    echo json_encode(['status' => 'error', 'error' => 'Tous les champs sont obligatoires.']);
    exit();
}

try {
    // Start a transaction
    $connection->beginTransaction();

    // Get the current date and time, then add 1 hour
    $dateTime = new DateTime();
    $dateTime->modify('+1 hour');  // Adds 1 hour to the current time

    // Format the date and time
    $order_date = $dateTime->format('Y-m-d'); // format: YYYY-MM-DD
    $order_time = $dateTime->format('H:i:s'); // format: HH:MM:SS

    // Insert the order with separate date and time
    $query = $connection->prepare("
        INSERT INTO orders (username, order_date, order_time, total_price, order_status, delivery_address)
        VALUES (?, ?, ?, ?, 'Processing', ?)
    ");
    $query->execute([$username, $order_date, $order_time, $total_price, $delivery_address]);

    // Get the order ID of the inserted order
    $order_id = $connection->lastInsertId();

    // Prepare the product IDs and quantities in the desired format: {"6": 2, "7": 1, "26": 1}
    $cartData = [];
    foreach ($cart as $productId => $product) {
        $cartData[$productId] = $product['quantity'];
    }

    // Convert the cart to JSON format for storage in the `order_items` table
    $product_ids_json = json_encode($cartData);

    // Insert the order items (product_ids) for the current order
    $itemQuery = $connection->prepare("
        INSERT INTO order_items (order_id, product_ids)
        VALUES (?, ?)
    ");
    $itemQuery->execute([$order_id, $product_ids_json]);

    // Clear the user's cart from the database
    $deleteQuery = $connection->prepare("DELETE FROM carts WHERE username = ?");
    $deleteQuery->execute([$username]);

    // Commit the transaction
    $connection->commit();

    echo json_encode(['status' => 'success']);
} catch (PDOException $e) {
    // Roll back the transaction if an error occurs
    $connection->rollBack();
    echo json_encode(['status' => 'error', 'error' => $e->getMessage()]);
}
?>
