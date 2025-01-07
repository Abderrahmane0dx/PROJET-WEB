<?php

// db.php
$servername = "localhost";  // Your database server
$dbname = "e_commerce";     // Your database name
$username = "root";         // Your database username
$password = "";             // Your database password

try {
    // Create a PDO connection
    $connection = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    
    // Set PDO error mode to exception for better error handling
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    // Handle connection errors
    die("Database connection failed: " . $e->getMessage());
}
?>
