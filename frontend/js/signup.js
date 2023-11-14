// let baseurl = 'https://marschat.onrender.com';
let baseurl = 'http://localhost:3000';
const formEl = document.querySelector("form")


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
            console.log(data)
        }).catch((err) => {
            console.log(err)
        })
})