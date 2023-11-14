// let baseurl = 'https://marschat.onrender.com';
let baseurl = 'http://localhost:3000';
const formEl = document.querySelector("form");
const myalert = document.getElementsByClassName("alert")[0];


formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    fetch(`${baseurl}/user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            myalert.style.display = "block";
            myalert.innerText = "Registration successful!";
            setTimeout(() => {
                window.location.href = "../pages/login.html";
            }, 1000);
        }).catch((err) => {
            console.log(err)
            myalert.style.display = "block";
            myalert.classList.remove("alert-primary");
            myalert.classList.add("alert-danger");
            myalert.innerText = "Registration failed!";
        })
})