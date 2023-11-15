let sidebarEl = document.getElementById("sidebar")
let mainBox = document.getElementById("mainBox")
let msgBox = document.getElementById("msgBox")
let showusername = document.getElementById("showusername");
let inputmsg = document.getElementById("inputmsg");
let userlistcontainer = document.getElementById("userlistcontainer");
let uploadedImageDisplay = document.getElementById("uploadedImageDisplay");
let uploadPreview = document.getElementById('uploadPreview');
let uploadImage = document.getElementById("uploadImage");
let sendImageBtn = document.getElementById("sendImageBtn");
let recipient = '';
let imageData = '';
// let baseurl = 'https://marschat.onrender.com'
let baseurl = 'http://localhost:3000';

let isTokenPresent = localStorage.getItem("marschattoken");

if (!isTokenPresent) {
    window.location.href = "./pages/login.html";
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

uploadImage.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        uploadedImageDisplay.style.display = 'flex';
        reader.onload = (e) => {
            imageData = e.target.result;
            uploadPreview.src = imageData;
        };

        reader.readAsDataURL(file);
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const socket = io(baseurl, {
        query: {
            token: isTokenPresent,
        },
    });

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
            if (ele.id !== socket.id) {
                return `<button class="btn btn-light my-1 users" data-id="${ele.id}" onclick="selectRecipient('${ele.id}')">
                ${ele.name}
                        </button>`
            } else {
                showusername.innerText = ele.name;
            }
        }).join("");

        userlistcontainer.innerHTML = htmlStr;
    })

    socket.on('connect_error', (error) => {
        alert(error.message);
        window.location.href = './pages/login.html';
    });

    socket.on('authenticationFailed', (data) => {
        console.error(`Authentication failed: ${data.message}`);
        window.location.href = './pages/login.html';
    });

    // Receive and display images
    sendImageBtn.addEventListener("click", () => {
        if (imageData) {
            uploadedImageDisplay.style.display = 'none';
            const div = document.createElement("div");
            const imgElement = document.createElement("img");
            imgElement.src = imageData;
            div.classList.add("sentmsg")
            div.append(imgElement)
            msgBox.appendChild(div);
            // send image
            socket.emit('image', { recipient, imageData });
        }
    })

    socket.on('image', ({ imageData }) => {
        const div = document.createElement("div");
        const imgElement = document.createElement("img");
        imgElement.src = imageData;
        div.classList.add("receivedmsg")
        div.append(imgElement)
        msgBox.appendChild(div);
    });
})