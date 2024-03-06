let currentUser;
let users = []
let guest = {
    color: 'black',
    contacts: [{ name: 'Guest', color: 'black', initials: 'G', email: '', phone: '' }],
    email: '',
    loggedIn: false,
    name: 'Guest',
    password: '',
    tasks: []
}

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
        setInitials();
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


async function navigateTo(page) {
    await updateUsers();
    window.location.href = page;
}


async function updateUsers() {
    if (currentUser['name'] == 'Guest') {
        guest = currentUser;
        saveGuestToLocalStorage();
    } else {
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (user['name'] == currentUser['name']) {
                currentUser['loggedIn'] = false;
                users.splice(i, 1, currentUser);
            }
        }
    }
    currentUser = {};
    await setItem('currentUser', JSON.stringify(currentUser));
    await setItem('users', JSON.stringify(users));
}

/**
 * gets the first letter of the name and the surname and puts them together
 * 
 * @param {string} name the name of the current contact
 * @returns a string with the initials of the name of the contact
 */
function getInitials(name) {
    let words = name.split(' ');
    let initials = words.map(word => word.charAt(0)).toString().replace(',', '');
    initials = initials.toUpperCase()
    return initials;
}

function setInitials() {
    let profile = document.getElementById('profile');
    if (profile != null) {
        profile.innerHTML = getInitials(currentUser['name']);
    }
}

