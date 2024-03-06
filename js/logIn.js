
async function init() {
    startGreetingAnimation();
    await load();
    loadGuestFromLocalStorage();
    autoFillForm();
}

function startGreetingAnimation() {
    if (window.innerWidth >= 960) {
        document.getElementById('logoPopup').classList.remove('d-none');
        setTimeout(() => {
            document.getElementById('logoPopup').classList.add('logo-popup-animation');
            document.getElementById('logoGreeting').classList.add('join-logo-greeting-animation');
            document.getElementById('mainContent').classList.remove('d-none');
        }, 125);
        setTimeout(() => document.getElementById('logoPopup').classList.add('d-none'), 1500);
    } else {
        startMobileGreetingAnimation();
    }
}

function guestLogin() {
    guest['loggedIn'] = true;
    currentUser = guest;
    setItem('currentUser', JSON.stringify(currentUser));
    window.open('summary.html', '_self');
}

function startMobileGreetingAnimation() {
    document.getElementById('logoPopupMobile').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('logoPopupMobile').classList.add('logo-popup-mobile-animation');
        document.getElementById('logoGreetingMobile').classList.add('join-logo-greeting-mobile-animation');
        document.getElementById('mainContent').classList.remove('d-none');
    }, 125);
    setTimeout(() => document.getElementById('logoPopupMobile').classList.add('d-none'), 1500);
}

async function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let user = users.find(u => u.email === email);
    currentUser = user;
    if (user && user.password === password) {
        currentUser['loggedIn'] = true;
        await setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'summary.html';
    } else {
        showWrongPassword();
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




