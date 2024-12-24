const loginBtn =  document.querySelector("#login");
const registerBtn =  document.querySelector("#register");
const loginForm =  document.querySelector(".login-form");
const registerForm =  document.querySelector(".register-form");


loginBtn.addEventListener('click',()=>{
    loginBtn.style.backgroundColor = "#21264D";
    registerBtn.style.backgroundColor = "rgba(255,255,255,0.2)";

    loginForm.style.left = "50%"
    registerForm.style.left= "-50%"

})

registerBtn.addEventListener('click',()=>{
    loginBtn.style.backgroundColor = "rgba(255,255,255,0.2)";
    registerBtn.style.backgroundColor = "#21264D";

    loginForm.style.left = "150%"
    registerForm.style.left= "50%"
})