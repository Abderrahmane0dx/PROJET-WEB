const loginBtn =  document.querySelector("#login");
const registerBtn =  document.querySelector("#register");
const loginForm =  document.querySelector(".login-form");
const registerForm =  document.querySelector(".register-form");
const usernameInput = loginForm.querySelector('input[name="username"]');
const passwordInput = loginForm.querySelector('input[name="password"]');


loginBtn.addEventListener('click',()=>{
    loginBtn.style.backgroundColor = "#21264D";
    registerBtn.style.backgroundColor = "rgba(255,255,255,0.2)";

    loginForm.style.left = "50%"
    registerForm.style.left= "-50%"

    loginForm.style.opacity = 1;
    registerForm.style.opacity =0;

    document.querySelector(".col-1").style.borderRadius = "0 30% 20% 0";

})

registerBtn.addEventListener('click',()=>{
    loginBtn.style.backgroundColor = "rgba(255,255,255,0.2)";
    registerBtn.style.backgroundColor = "#21264D";

    loginForm.style.left = "150%"
    registerForm.style.left= "50%"

    loginForm.style.opacity = 0;
    registerForm.style.opacity =1;

    document.querySelector(".col-1").style.borderRadius = "0 20% 30% 0";
})

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();  // Prevent form submission

    const username = usernameInput.value;
    const password = passwordInput.value;

    // Send login data using fetch API
    fetch('../PHP/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.text())
    .then(text => {
        console.log('Raw response:', text);  // Log raw response
        return JSON.parse(text);  // Manually parse the JSON
    })
    .then(data => {
        if (data.success) {
            window.location.href = "../HTML/client.html";  // Redirect to client page
        } else {
            usernameInput.style.border = "4px solid red";
            passwordInput.style.border = "4px solid red";
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Remove red border when user starts typing in username field
usernameInput.addEventListener('input', () => {
    usernameInput.style.border = "";
    passwordInput.style.border = "";
});

// Remove red border when user starts typing in password field
passwordInput.addEventListener('input', () => {
    usernameInput.style.border = "";
    passwordInput.style.border = "";
});