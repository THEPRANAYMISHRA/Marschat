let sidebarEl = document.getElementById("sidebar")
let mainBox = document.getElementById("mainBox")
let msgBox = document.getElementById("msgBox")
let inputmsg = document.getElementById("inputmsg")
let userlistcontainer = document.getElementById("userlistcontainer")
let recipient = ''
let baseurl = 'https://marschat.onrender.com'

function handlesidebar() {
    if (sidebarEl.classList.contains("sidebarOpen")) {
        sidebarEl.classList.remove("sidebarOpen")
    } else {
        sidebarEl.classList.add("sidebarOpen")
    }
}

function selectRecipient(recp) {
    recipient = recp;
    const allLiElements = document.querySelectorAll('.users');
    allLiElements.forEach((li) => {
        li.classList.remove('btn-primary');
    });

    // Add btn-primary class to the clicked li element
    const clickedLiElement = document.querySelector(`.users[data-id="${recp}"]`);
    clickedLiElement.classList.add('btn-primary');
    msgBox.innerHTML = '';
}


document.addEventListener('DOMContentLoaded', () => {
    const socket = io(baseurl);

    // Send a message when the form is submitted
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const message = inputmsg.value;
        if (message !== "" && recipient != '') {
            let htmlstr = `<div class="sentmsg">${message}</div>`;
            msgBox.innerHTML += htmlstr;
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
        let htmlstr = `<div class="receivedmsg">${message}</div>`
        msgBox.innerHTML += htmlstr
    });

    socket.on("userList", (list) => {
        let htmlStr = list.map((ele) => {
            if (ele !== socket.id) {
                return `<li class="nav-item btn my-1 users" data-id="${ele}" onclick="selectRecipient('${ele}')">
                            <a href="#" class="nav-link text-white">
                            ${ele}
                            </a>
                        </li>`
            }
        }).join("");

        userlistcontainer.innerHTML = htmlStr;
    })

})