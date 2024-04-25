/**
 * starts the greeting animation, loads the data from the server, also loads the guest from the local storage 
 * and if the remember me checkbos is checked autofills the form
 */
async function init() {
    resetCurrentUser();
    saveCurrentUser();
    startGreetingAnimation();
    await load();
    loadGuestFromLocalStorage();
    autoFillForm();
}

/**
 * if the window is greater than 960px it starts the animation for the greeting animation of the desktop version
 * if it is smaller it starts the one for the mobile version
 */
function startGreetingAnimation() {
    if (window.innerWidth >= 960) {
        document.getElementById('logoPopup').classList.remove('d-none');
        setTimeout(() => {
            document.getElementById('logoGreeting').classList.add('join-logo-greeting-animation');
            document.getElementById('mainContent').classList.remove('d-none');
        }, 125);
        setTimeout(() => {
            document.getElementById('logoPopup').classList.add('logo-popup-animation');
            document.getElementById('logoPopup').classList.add('d-none')
        }, 1500);
    } else {
        startMobileGreetingAnimation();
    }
}

/**
 * starts the mobile greeting animation
 */
function startMobileGreetingAnimation() {
    document.getElementById('logoPopupMobile').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('logoGreetingMobile').classList.add('join-logo-greeting-mobile-animation');
        document.getElementById('mainContent').classList.remove('d-none');
        document.getElementById('logoPopupMobile').classList.add('logo-popup-mobile-animation');
    }, 125);
    
    setTimeout(() => {
        document.getElementById('logoPopupMobile').classList.add('d-none')
    }, 1500);
}

/**
 * checks which user has the typed in email and sets this user as currentUser
 * if the password and the user password are strict equal it sets the loggedIn status of 
 * currentUser to true and saves currentUser on the server, then pipes to the summary page
 * if the password is not correct it desplays the wrong password message
 */
async function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let user = users.find(u => u.email === email);
    currentUser = user;
    if (user && user.password === password) {
        currentUser['loggedIn'] = true;
        // await setItem('currentUser', JSON.stringify(currentUser));
        saveCurrentUser();
        window.location.href = 'summary.html';
    } else {
        showWrongPassword();
    }
}

/**
 * display the "wrong password" sentence
 */
function showWrongPassword() {
    document.getElementById('wrong-password').classList.remove('hide');
}

/**
 * changes the img to show the password
 */
function showPassword() {
    let img = document.getElementById('lock');
    img.src = './assets/img/visibility_off.png';
}

/**
 * resets the password visability, if the input is empty
 */
function resetPasswordVisibility() {
    let img = document.getElementById('lock');
    let passwordInput = document.getElementById('password');

    if (passwordInput.value === '') {
        img.src = './assets/img/lock.svg';
    }
}

/**
 * toggles the icon to show or hide the password
 */
function togglePasswordVisibility() {
    let img = document.getElementById('lock');
    let passwordInput = document.getElementById('password');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        img.src = './assets/img/visibility.png';
    } else {
        passwordInput.type = 'password';
        img.src = './assets/img/visibility_off.png';
    }
}

/**
 * This Function ist just for testing and demonstration purpose, the original guest login is deactivated
 * and will be activated once it is in production
 */
// async function guestLogin() {
//     let testGuest = findTestGuest();
//     testGuest['loggedIn'] = true;
//     currentUser = testGuest;
//     saveCurrentUser();
//     window.open('summary.html', '_self');
// }

/**
 * sets the loggedIn status to true and sets currentUser as guest and saves it to the server
 * then pipes to summary
 */
async function guestLogin() {
    guest = findTestGuest();
    guest['loggedIn'] = true;
    currentUser = guest;
    saveCurrentUser();
    window.open('summary.html', '_self');
}

/**
 * Just for testing purpose 
 * sets the currentUser to the predefined Test Guest 
 * 
 * @returns testGuest Object
 */
function findTestGuest() {
    let testGuest = users.find(user => user['name'] == 'Test Guest');
    return testGuest;
}
/**
 * checks if the remember me checkbox is checked in if so sends the email and password to the local storage
 * if it is not checked it removes the item from the local storage
 */
function rememberMe() {
    let rememberCheckbox = document.getElementById('rememberMeCheckbox');
    if (rememberCheckbox.checked) {
        localStorage.setItem('rememberedEmail', document.getElementById('email').value);
        localStorage.setItem('rememberedPassword', document.getElementById('password').value);
    } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
    }
}

/**
 * if the items are saved to the local storage it loads them and puts the value as value of the inputs
 */
function autoFillForm() {
    let rememberedEmail = localStorage.getItem('rememberedEmail');
    let rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail && rememberedPassword) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('password').value = rememberedPassword;
        document.getElementById('rememberMeCheckbox').checked = true;
    }
}