<?php

// db.php
$servername = "localhost";  // Your database server
$dbname = "e_commerce";     // Your database name
$username = "root";         // Your database username
$password = "";             // Your database password


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
