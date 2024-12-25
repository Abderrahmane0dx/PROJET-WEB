<?php
// Database configuration
$host = 'localhost';          // Database host (e.g., 'localhost' for most setups)
$dbname = 'e_commerce';    // Your database name
$username = 'root';  // Your database username
$password = 'Dx04&bin02a';  // Your database password

try {
    // Create a new PDO instance and establish a connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    // Set PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Optionally, you can set the default character set for the connection
    $pdo->exec("SET NAMES 'utf8'");

} catch (PDOException $e) {
    // Handle connection errors
    die("Connection failed: " . $e->getMessage());
}
?>
