<?php 
// Include the database connection
include('db.php');
// Set JSON header
header('Content-Type: application/json');

// Get the username from the request
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];

try {
    // Query to fetch the wishlist for the user
    $query = $connection->prepare("SELECT wishlist FROM user_wishlists WHERE username = ?");
    $query->execute([$username]);
    $wishlist = $query->fetch(PDO::FETCH_ASSOC);

    if ($wishlist) {
        // Return the wishlist as JSON
        echo json_encode(['status' => 'success', 'wishlist' => json_decode($wishlist['wishlist'])]);
    } else {
        // No wishlist found, return empty array
        echo json_encode(['status' => 'success', 'wishlist' => []]);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
