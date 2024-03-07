
async function init() {
    await load();
    //acceptPolicy();
}

async function register() {
    let userName = document.getElementById('userName');
    let password = document.getElementById('password');
    let email = document.getElementById('email');

    if (matchPass()) {
        users.push({
            email: email.value,
            password: password.value,
            name: userName.value,
            color: 'black',
            loggedIn : false,
            tasks: [],
            contacts: [{name: userName.value, color: 'black', initials: getInitials(userName.value), email: email.value, phone: ''}]
        });
        await setItem('users', JSON.stringify(users)); // key = 'users', value
        pipeToLogin();
    }


}

function pipeToLogin() {
    startSignupAnimation();
    resetForm();
    setTimeout(() => window.open('login.html', '_self'), 800);
}

function resetForm() {
    userName.value = '';
    email.value = '';
    confirmPassword.value = '';
    password.value = '';

}

function matchPass() {
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');

    if (password.value == confirmPassword.value) {
        return true;
    }
    else {
        wrongPasswordText();
        return false;
    }
}

function acceptPolicy() {
    let acceptCheckbox = document.getElementById('checkbox');
    let signUpButton = document.getElementById('sign-up-btn');
    
    if (acceptCheckbox.checked) {
        signUpButton.classList.add('hover-active');
        signUpButton.disabled = false;
    } else {
        signUpButton.classList.remove('hover-active');
        signUpButton.disabled = true;
    }
}


function startSignupAnimation() {
    document.getElementById('signupSuccessful').classList.add('signup-succesful-animation');
}

function wrongPasswordText() {
    document.getElementById('wrongPasswordText').classList.remove('hide');
}