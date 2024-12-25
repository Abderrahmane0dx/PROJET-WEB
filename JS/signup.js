//signup.js


// Helper function for setting border color
function setInputBorderColor(input, color) {
    input.style.borderColor = color;
}

// Validate the inputs
function validateInputs() {
    const email = emailInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;

    let isValid = true;

    // Validate email format using a simple regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        setInputBorderColor(emailInput, 'red');
        isValid = false;
    } else {
        setInputBorderColor(emailInput, 'green');
    }

    // Validate username - it should be at least 3 characters
    if (username.length < 3) {
        setInputBorderColor(usernameInput, 'red');
        isValid = false;
    } else {
        setInputBorderColor(usernameInput, 'green');
    }

    // Validate password - should be at least 8 characters
    if (password.length < 8) {
        setInputBorderColor(passwordInput, 'red');
        isValid = false;
    } else {
        setInputBorderColor(passwordInput, 'green');
    }

    return isValid;
}

// Handle form submission
registerForm.addEventListener('submit', (event) => {
    event.preventDefault();  // Prevent the default form submission

    if (!validateInputs()) {
        return; // If any input is invalid, stop submission
    }

    const email = emailInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Create the data object to send to the server
    const data = {
        email: email,
        username: username,
        password: password
    };

    // Send data to the server using fetch and POST method
    fetch('../PHP/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Account created successfully!");
            // Optionally redirect to login page or another page
            window.location.href = "login.html";  // Redirect to login page after successful registration
        } else {
            alert(data.message);  // Show error message from the server
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});
