const loginBtn =  document.querySelector("#login");
const registerBtn =  document.querySelector("#register");
const loginForm =  document.querySelector(".login-form");
const registerForm =  document.querySelector(".register-form");


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

// Handle login form submission
document.querySelector(".login-form .input-submit").addEventListener('click', function (event) {
    event.preventDefault();

    const username = document.querySelector('.login-form [name="username"]').value;
    const password = document.querySelector('.login-form [name="password"]').value;

    // Perform basic validation on the client side
    if (username === "" || password === "") {
        alert("Please fill in both fields.");
        return;
    }

    // Create an AJAX request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "login.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Send the login data to PHP
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);

            if (response.status === 'success') {
                // Redirect to the main page (you can change this URL)
                window.location.href = '/HTML/client.html'; // Example: redirect to homepage
            } else {
                // Show an error message if login fails
                alert(response.message); // Shows "Incorrect username or password"
            }
        }
    };

    // Send the username and password to the PHP backend
    xhr.send("username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password));
});