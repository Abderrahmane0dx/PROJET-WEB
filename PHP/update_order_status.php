<?php
// update_order_status.php
include('db.php');

header('Content-Type: application/json');

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['orderIds']) || !isset($data['status'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required data']);
    exit;
}

$orderIds = $data['orderIds'];
$status = $data['status'];

// Validate status
$validStatuses = ['ACCEPTED', 'CANCELED', 'PENDING'];
if (!in_array($status, $validStatuses)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid status']);
    exit;
}

try {
    $connection->beginTransaction();

    $query = $connection->prepare("UPDATE orders SET order_status = ? WHERE order_id = ?");
    
    foreach ($orderIds as $orderId) {
        $query->execute([$status, $orderId]);
    }

    $connection->commit();
    echo json_encode(['status' => 'success', 'message' => 'Orders updated successfully']);
} catch (PDOException $e) {
    $connection->rollBack();
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>