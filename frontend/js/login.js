let baseurl = 'https://marschat.onrender.com'
// let baseurl = 'http://localhost:3000';
const formEl = document.querySelector("form")
const myalert = document.getElementsByClassName("alert")[0]
const loginBtnText = document.getElementById("loginBtnText");
const loader = document.getElementById("loader");

formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (email == "" || password == "") {
        myalert.style.display = "block";
        myalert.classList.remove("alert-primary");
        myalert.classList.add("alert-danger");
        myalert.innerText = "All the feilds are required!";
    }

    loginBtnText.style.display = 'none';
    loader.style.display = 'block';

    fetch(`${baseurl}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        localStorage.setItem("marschattoken", data.token);
        myalert.style.display = "block";
        myalert.innerText = "Login successful!";
        setTimeout(() => {
            window.location.href = "../index.html"
        }, 1000);
    }).catch((err) => {
        myalert.style.display = "block";
        myalert.classList.remove("alert-primary");
        myalert.classList.add("alert-danger");
        myalert.innerText = "Login failed!";
    }).finally(() => {
        loginBtnText.style.display = 'block';
        loader.style.display = 'none';
    })
})

// function setCookie(value) {
//     var currentDate = new Date();
//     var expiryDate = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000));
//     var expiryDateString = expiryDate.toUTCString();
//     document.cookie = `token=${value}; expires=${expiryDateString}; path=/`;
// }
