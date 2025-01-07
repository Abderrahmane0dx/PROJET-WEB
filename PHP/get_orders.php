<?php
// Include the database connection
include('db.php');

// Set JSON header
header('Content-Type: application/json');

try {
    // Query to fetch the 5 most recent orders
    $query = $connection->prepare("SELECT * FROM orders ORDER BY order_date DESC LIMIT 5");
    $query->execute();

    // Fetch the orders
    $orders = $query->fetchAll(PDO::FETCH_ASSOC);

    if ($orders) {
        echo json_encode(['status' => 'success', 'orders' => $orders]);
    } else {
        echo json_encode(['status' => 'success', 'orders' => []]);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
