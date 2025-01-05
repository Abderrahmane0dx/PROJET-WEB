<?php
// add_product.php

// Include the database connection
include('db.php');

// Set JSON header
header('Content-Type: application/json');

// Get the data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Extract product data
$name = $data['name'];
$price = $data['price'];
$description = $data['description'];
$quantity = $data['quantity'];
$photo_url = $data['photo_url'];
$device_type = $data['device_type'];

// Validate the data (Optional: You can add more validations as needed)
if (empty($name) || empty($price) || empty($quantity) || empty($photo_url)) {
    echo json_encode(['status' => 'error', 'error' => 'All fields are required.']);
    exit();
}

// Insert the new product into the database
try {
    $query = $connection->prepare("INSERT INTO products (name, price, description, quantity, photo_url, device_type) 
                                    VALUES (?, ?, ?, ?, ?, ?)");
    $query->execute([$name, $price, $description, $quantity, $photo_url, $device_type]);

    echo json_encode(['status' => 'success']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'error' => $e->getMessage()]);
}
?>
