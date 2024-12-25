<?php
include('db.php');  // Include the database connection file

if ($pdo) {
    echo "Connected successfully!";
} else {
    echo "Connection failed!";
}
?>
