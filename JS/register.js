const registerForm = document.querySelector(".register-form");
const registerUsernameInput = registerForm.querySelector('input[name="username"]');
const registerPasswordInput = registerForm.querySelector('input[name="password"]');
const registerEmailInput = registerForm.querySelector('input[name="email"]');
const registerButton = document.getElementById('registerbtn');

// Function to show a toast message
function showToast(message) {
    alert(message); // Replace with your custom toast implementation if necessary
}

// Registration handler
const registerHandler = async (event) => {
    event.preventDefault();

    const username = registerUsernameInput.value.trim();
    const password = registerPasswordInput.value.trim();
    const email = registerEmailInput.value.trim();

    // Front-end validations
    if (!username || !password || !email) {
        showToast("All fields are required.");
        return;
    }

    if (!/^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/.test(email)) {
        showToast("Invalid email format.");
        return;
    }

    if (password.length < 5) {
        showToast("Password must be at least 5 characters long.");
        return;
    }

    try {
        const response = await fetch('../PHP/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email }),
        });

        const result = await response.json();

        if (result.status === 'success') {
            localStorage.setItem('username', result.username);
            showToast("Registration successful");

            setTimeout(() => {
                window.location.href = '../HTML/testhomepage.html';
            }, 1500);
        } else {
            showToast(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('An error occurred. Please try again.');
    }
};


