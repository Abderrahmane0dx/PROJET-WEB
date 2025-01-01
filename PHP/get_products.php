<?php
// Include database connection
include('db.php');

// Set the header to JSON
header('Content-Type: application/json');

try {
    // Query to get the required fields, including the id
    $query = $connection->prepare("SELECT id, name, price, photo_url, device_type FROM products");
    $query->execute();
    $products = $query->fetchAll(PDO::FETCH_ASSOC);

    // Return products as JSON
    echo json_encode(['status' => 'success', 'products' => $products]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error', 'error' => $e->getMessage()]);
}
exit();
?>
