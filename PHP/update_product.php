<?php
// update_product.php

// Include the database connection
include('db.php');

// Set JSON header
header('Content-Type: application/json');

// Get the data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Extract product data
$id = $data['id'];
$name = $data['name'];
$price = $data['price'];
$description = $data['description'];
$quantity = $data['quantity'];
$photo_url = $data['photo_url'];
$device_type = $data['device_type'];

// Validate the data (Optional: You can add more validations as needed)
if (empty($id) || empty($name) || empty($price) || empty($quantity) || empty($photo_url)) {
    echo json_encode(['status' => 'error', 'error' => 'All fields are required.']);
    exit();
}

// Update the product in the database
try {
    $query = $connection->prepare("UPDATE products SET name = ?, price = ?, description = ?, quantity = ?, photo_url = ?, device_type = ? WHERE id = ?");
    $query->execute([$name, $price, $description, $quantity, $photo_url, $device_type, $id]);

    echo json_encode(['status' => 'success']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'error' => $e->getMessage()]);
}
?>
