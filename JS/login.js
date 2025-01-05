const loginBtn =  document.querySelector("#login");
const registerBtn =  document.querySelector("#register");
const loginForm =  document.querySelector(".login-form");
const usernameInput = loginForm.querySelector('input[name="username"]');
const passwordInput = loginForm.querySelector('input[name="password"]');
const loginhandeler = document.getElementById('loginbtn');


//adding an event listener to change from the signup form to the signin form:
loginBtn.addEventListener('click',()=>{
    loginBtn.style.backgroundColor = "#21264D";
    registerBtn.style.backgroundColor = "rgba(255,255,255,0.2)";

    loginForm.style.left = "50%"
    registerForm.style.left= "-50%"

    loginForm.style.opacity = 1;
    registerForm.style.opacity =0;

    document.querySelector(".col-1").style.borderRadius = "0 30% 20% 0";

})

//adding an event listener to change from the signin form to the signup form:
registerBtn.addEventListener('click',()=>{
    loginBtn.style.backgroundColor = "rgba(255,255,255,0.2)";
    registerBtn.style.backgroundColor = "#21264D";

    loginForm.style.left = "150%"
    registerForm.style.left= "50%"

    loginForm.style.opacity = 0;
    registerForm.style.opacity =1;

    document.querySelector(".col-1").style.borderRadius = "0 20% 30% 0";
})

// the fonction to handle login:
const loginhandeling = async (event) => {
    event.preventDefault();

    // Getting the UserName And The PassWord from the inputs:
    const username = usernameInput.value;
    const password = passwordInput.value;

    const data = {
        username,
        password,
    };

    try {
        // Calling the login.php file with the fetch:
        const response = await fetch('../PHP/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.status === 'success') {
            localStorage.setItem('username', result.username);

            if (result.redirect === 'admin') {
                alert("Admin login successful");
                setTimeout(() => {
                    window.location.href = '../HTML/admin.html';
                }, 1500);
            } else {
                alert("Login successful");

                // Fetch the wishlist after login
                const wishlistResponse = await fetch('../PHP/get_wishlist.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: result.username })
                });

                const wishlistResult = await wishlistResponse.json();
                if (wishlistResult.status === 'success') {
                    // Save the wishlist to localStorage
                    localStorage.setItem('wishlist', JSON.stringify(wishlistResult.wishlist));
                } else {
                    // Initialize an empty wishlist if none found
                    localStorage.setItem('wishlist', JSON.stringify([]));
                }

                setTimeout(() => {
                    window.location.href = '../HTML/HOMEPAGE.html';
                }, 1500);
            }
        } else {
            showToast(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('An error occurred. Please try again.');
    }
};
