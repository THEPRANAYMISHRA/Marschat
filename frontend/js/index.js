let sidebarEl = document.getElementById("sidebar")
let mainBox = document.getElementById("mainBox")
let msgBox = document.getElementById("msgBox")
let showusername = document.getElementById("showusername");
let inputmsg = document.getElementById("inputmsg")
let userlistcontainer = document.getElementById("userlistcontainer")
let recipient = ''
let baseurl = 'https://marschat.onrender.com'
// let baseurl = 'http://localhost:3000';

let isTokenPresent = document.cookie.split("=")[1];

console.log(isTokenPresent);

if (isTokenPresent) {
    fetch(`${baseurl}/user/verify`, {
        method: "GET",
        headers: {
            Authorization: isTokenPresent,
        },
    }).then((res) => {
        return res.json()
    }).then((data) => {
        showusername.innerText = data.name;
    }).catch((err) => {
        console.log(err);
        alert("something went wrong..");
        return;
    });
} else {
    window.location.href = "../pages/login.html";
}

function handlesidebar() {
    if (sidebarEl.classList.contains("sidebarClosed")) {
        sidebarEl.classList.remove("sidebarClosed");
        for (let child of sidebarEl.children) {
            child.style.display = 'block'; // Change 'block' to 'initial' if needed
        }
    } else {
        sidebarEl.classList.add("sidebarClosed");
        for (let child of sidebarEl.children) {
            child.style.display = 'none';
        }
    }
}


function selectRecipient(recp) {
    recipient = recp;
    const allbuttonElements = document.querySelectorAll('.users');
    allbuttonElements.forEach((button) => {
        button.classList.remove('btn-danger');
    });

    // Add btn-primary class to the clicked li element
    const clickedLiElement = document.querySelector(`.users[data-id="${recp}"]`);
    console.log(clickedLiElement)
    clickedLiElement.classList.remove('btn-light');
    clickedLiElement.classList.add('btn-danger');
    msgBox.innerHTML = '';
}


document.addEventListener('DOMContentLoaded', () => {
    const socket = io(baseurl);

    // Send a message when the form is submitted
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const message = inputmsg.value;
        if (message !== "" && recipient != '') {
            var div = document.createElement('div');
            div.textContent = message;
            div.classList.add('sentmsg');
            msgBox.append(div);

            const payload = {
                sender: socket.id,
                recipient: recipient,
                message: message
            };
            socket.emit('message', payload);
            inputmsg.value = '';
        } else {
            return
        }
    });

    // Receive and display messages
    socket.on('message', (payload) => {
        let { message } = payload;
        var div = document.createElement('div');
        div.textContent = message;
        div.classList.add('receivedmsg');
        msgBox.append(div);
    });

    socket.on("userList", (list) => {
        let htmlStr = list.map((ele) => {
            if (ele !== socket.id) {
                return `<button class="btn btn-light my-1 users" data-id="${ele}" onclick="selectRecipient('${ele}')">
                ${ele}
                        </button>`
            }
        }).join("");

        userlistcontainer.innerHTML = htmlStr;
    })

})