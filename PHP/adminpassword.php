<?php
// The password you want to hash
$password = 'admin';

// The salt you're using in your PHP code
$salt = 'salt';

// Combine the salt and password
$combinedPassword = $salt . $password;

// Hash it using SHA-256
$hashedPassword = hash('sha256', $combinedPassword);

// Output the result (you can copy this value to insert in the database)
echo $hashedPassword;
?>
