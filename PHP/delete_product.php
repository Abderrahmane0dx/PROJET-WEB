<?php
// delete_product.php

// Include the database connection
include('db.php');

// Set JSON header
header('Content-Type: application/json');

// Get the data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Extract the product ID
$id = $data['id'];

// Validate the ID
if (empty($id)) {
    echo json_encode(['status' => 'error', 'error' => 'Product ID is required.']);
    exit();
}

// Delete the product from the database
try {
    $query = $connection->prepare("DELETE FROM products WHERE id = ?");
    $query->execute([$id]);

    echo json_encode(['status' => 'success']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'error' => $e->getMessage()]);
}
?>
