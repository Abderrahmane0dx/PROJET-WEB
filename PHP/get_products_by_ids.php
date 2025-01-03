// get_products_by_ids.php
<?php
// Include the database connection
include('db.php');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $productIds = $data['productIds'];
    
    // Convert array to string for IN clause
    $ids = implode(',', array_map(function($id) use ($conn) {
        return $conn->real_escape_string($id);
    }, $productIds));
    
    $query = "SELECT * FROM products WHERE id IN ($ids)";
    $result = $conn->query($query);
    
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    
    echo json_encode([
        "status" => "success",
        "products" => $products
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error fetching products: " . $e->getMessage()
    ]);
}

$conn->close();
?>