<?php 
// Include the database connection
include('db.php');
// Set JSON header
header('Content-Type: application/json');

// Get the data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Get username and wishlist
$username = $data['username'];
$wishlist = json_encode($data['wishlist']);  // Convert wishlist array to JSON

// Check if wishlist is empty
if (empty($wishlist)) {
    echo json_encode(['status' => 'error', 'error' => 'Empty wishlist']);
    exit();
}

try {
    // Check if the user already has a wishlist
    $query = $connection->prepare("SELECT id FROM user_wishlists WHERE username = ?");
    $query->execute([$username]);
    $existingWishlist = $query->fetch(PDO::FETCH_ASSOC);

    if ($existingWishlist) {
        // Update the existing wishlist
        $updateQuery = $connection->prepare("UPDATE user_wishlists SET wishlist = ? WHERE username = ?");
        $updateQuery->execute([$wishlist, $username]);
        echo json_encode(['status' => 'success']);
    } else {
        // Insert a new wishlist for the user
        $insertQuery = $connection->prepare("INSERT INTO user_wishlists (username, wishlist) VALUES (?, ?)");
        $insertQuery->execute([$username, $wishlist]);
        echo json_encode(['status' => 'success']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'error' => $e->getMessage()]);
}
?>
