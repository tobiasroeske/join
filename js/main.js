let currentUser;
let users = []

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    changeClassToActive();
}

async function load() {
    try {
        currentUser = JSON.parse(await getItem('currentUser'));
        users = JSON.parse(await getItem('users'));
    } catch (error) {
        console.error('Loading error:' + error);
    }
}

function changeClassToActive() {
    let activePage = window.location.pathname;
    let navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.href.includes(`${activePage}`)) {
            link.classList.add('active-nav');
            link.querySelector('img').classList.add('active-img')
        }
    })
}

function stopCurrentAction(event) {
    event.stopPropagation();
}


function toggleProfileOptions() {
    var profileOptions = document.getElementById("profileOptions");
    if (profileOptions.style.display === "none") {
        profileOptions.style.display = "block";
    } else {
        profileOptions.style.display = "none";
    }
}


function navigateTo(page) {
    updateUsers();
    window.location.href = page;
}

function updateUsers() {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user['name'] == currentUser['name']) {
            users.splice(i, 1, currentUser);
        }
    }
    setItem('users', JSON.stringify(users));
}
