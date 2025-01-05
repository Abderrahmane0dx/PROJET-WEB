<?php
// Include the database connection
include('db.php');

// Set JSON header
header('Content-Type: application/json');

try {
    // Query to fetch all orders from the database
    $query = $connection->prepare("SELECT * FROM orders");
    $query->execute();
    
    // Fetch all orders
    $orders = $query->fetchAll(PDO::FETCH_ASSOC);

    if ($orders) {
        // Return orders as JSON
        echo json_encode(['status' => 'success', 'orders' => $orders]);
    } else {
        // No orders found, return an empty array
        echo json_encode(['status' => 'success', 'orders' => []]);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
