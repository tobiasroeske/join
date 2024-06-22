let currentUser;
let users = []
let today;
const GUEST_ID = '-O-pjLwaYwAY68FHPEvL'
let guest = {
    color: 'black',
    contacts: [{ name: 'Guest Profile', color: 'black', initials: 'GP', email: '', phone: '' }],
    email: '',
    loggedIn: false,
    name: 'Guest',
    password: '',
    tasks: []
}

/**
 * loads the html templates, then checks the current page and gives the current page an active class
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    checkCurrentPage();
    changeClassToActive();
}

/**
 * loads the data from the server
 */
async function load() {
    loadCurrentUser();
    try {
        users = await getUsersArray();
        console.log(users);
        setInitials();
    } catch (error) {
        console.error('Loading error:' + error);
    }
}

async function loadJustUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (error) {
        console.error('Loading error:' + error);
    }
}

function saveCurrentUser() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function loadCurrentUser() {
    let currentUserAsString = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUserAsString) {
        currentUser = currentUserAsString;
    }
}

async function updateCurrentUserAndLeave(page) {
    saveCurrentUser();
    goToPage(page);
}

/**
 * resets the currentUser obejct so it can be checked if logged in
 */
function resetCurrentUser() {
    currentUser = {
        color: 'black',
        contacts: [],
        email: '',
        loggedIn: false,
        name: '',
        password: '',
        tasks: []
    }
}

/**
 * checks which pathname the current Page has and then gives the nav link the active-nav class in case
 * the links href includes the current Page
 */
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

/**
 * checks if the current page is legalNotice, privacyPolicy or help and if so, hides the profile container in the header
 */
function checkCurrentPage() {
    let currentPage = window.location.pathname;
    if (currentPage.includes('legalNotice.html') || currentPage.includes('privacyPolicy.html') || currentPage.includes('help.html')) {
        document.getElementById('headerRight').classList.add('d-none');
    }
}

/**
 * stops to call functions which are not meant to be called. Especially onclick funtion of the parent elements
 * 
 * @param {event} event any event
 */
function stopCurrentAction(event) {
    event.stopPropagation();
}

/**
 * hides the desired popup
 * 
 * @param {string} id id of the popup 
 */
function closePopup(id) {
    document.getElementById(id).classList.add('d-none');
}

/**
 * toggles the profile options
 */
function toggleProfileOptions() {
    let profileOptions = document.getElementById("profileOptions");
    profileOptions.classList.toggle('d-none');
}


/**
 * pipes to the desired page
 * 
 * @param {url} page url of the page to pipe to
 */
function goToPage(page) {
    window.location.href = page;
}

/**
 * updates the users and pipes to the login page
 */
async function logout() {
    currentUser['loggedIn'] = false;
    await updateUsers();
    window.open('login.html', '_self');
}

/**
 * if the currentUser is guest it saves the guest to the local storage
 * if not it changes the loggedIn status of currentUser to false and exchanges the matching user in the 
 * users array and saves users and currentUser to the server
 */
async function updateUsers() {
    if (currentUser.id == GUEST_ID) {
        guest = currentUser;
        saveGuestToLocalStorage();
        await updateSingleUser(guest.id, guest);
    } else {
        saveCurrentUser();
        await updateSingleUser(currentUser.id, currentUser);
        await load();
    }
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

/**
 * sets the initials of the currentUser in the profile icon, if it exists
 */
function setInitials() {
    let profile = document.getElementById('profile');
    if (profile != null) {
        profile.innerHTML = getInitials(currentUser['name']);
    }
}

/**
 * checks if currentUser is loggedIn
 */
function checkIfLoggedIn() {
    if (!currentUser['loggedIn']) {
        window.open('login.html', '_self');
    }
}

function getCurrentDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2); // Month is 0-indexed
    let day = ('0' + today.getDate()).slice(-2); // Day of the month

    let formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

