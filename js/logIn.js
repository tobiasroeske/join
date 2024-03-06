let currentUser;


async function init() {
    startGreetingAnimation();
    load();
    autoFillForm();
}

function startGreetingAnimation() {
    if (window.innerWidth >= 960) {
    document.getElementById('logoPopup').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('logoPopup').classList.add('logo-popup-animation');
        document.getElementById('logoGreeting').classList.add('join-logo-greeting-animation');
        document.getElementById('mainContent').classList.remove('d-none');
        },125);
    setTimeout(() => document.getElementById('logoPopup').classList.add('d-none'), 1500);
    } else {
        startMobileGreetingAnimation();
    }
}

function startMobileGreetingAnimation() {
    document.getElementById('logoPopupMobile').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('logoPopupMobile').classList.add('logo-popup-mobile-animation');
        document.getElementById('logoGreetingMobile').classList.add('join-logo-greeting-mobile-animation');
        document.getElementById('mainContent').classList.remove('d-none');
        },125);
    setTimeout(() => document.getElementById('logoPopupMobile').classList.add('d-none'), 1500);
}

async function load() {
    try {
        /*Loading user data from memory*/
        await loadUsers();
    } catch (error) {
        console.error('Error initializing:', error);
        /*Error handling if loading fails*/
    }
}

async function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    /*Check that the email and password fields are not empty*/
    if (email.trim() === '' || password.trim() === '') {
        alert('Please enter email and password');
        return;
    }

    try {
        /*Loading user data from local storage*/
        let users = JSON.parse(await getItem('users'));
        /*Search for a user with the specified email address*/
        let user = users.find(u => u.email === email);
        currentUser = user;
        /*Check if the user was found and if the password matches*/
        if (user && user.password === password) {
            /*saccessful login*/
            currentUser['loggedIn'] = true;
            await setItem('currentUser', JSON.stringify(currentUser));
            /*redirect to homepage*/
            window.location.href = 'summary.html';
        } else {
            /*test for rong email or password*/
            showWrongPassword();
        
        }
    } catch (error) {
        /*404 error */
        console.error('Error:', error);
    }
}

function showWrongPassword() {
    document.getElementById('wrong-password').classList.remove('hide');
}

function showPasswordVisibility() {

}

function showPassword() {
    let img = document.getElementById('lock');
    img.src = './assets/img/visibility_off.png';
}

function resetPasswordVisibility() {
    let img = document.getElementById('lock');
    let passwordInput = document.getElementById('password');

    if (passwordInput.value === '') {
        img.src = './assets/img/lock.svg';
    }
}

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

/*========RememberMe=============*/

/**/
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

function autoFillForm() {
    let rememberedEmail = localStorage.getItem('rememberedEmail');
    let rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail && rememberedPassword) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('password').value = rememberedPassword;
        document.getElementById('rememberMeCheckbox').checked = true;
    }
}

// window.onload = function() {
//     /* Load the user array first*/
//     init(); 
//     autoFillForm(); // Füllen Sie dann das Formular aus
// }

// document.querySelector('.login-form').addEventListener('submit', function() {
//     rememberMe();
// });



