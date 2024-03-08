/**
 * loads the data from the server
 */
async function init() {
    resetCurrentUser();
    await saveCurrentUser();
    await load();
}

/**
 * checks if the typed in passwords are the same, if so it pushes a new user object to the users array
 * then saves the users array on the server and pipes back to the login page
 */
async function register() {
    let userName = document.getElementById('userName');
    let password = document.getElementById('password');
    let email = document.getElementById('email');

    if (checkIfPasswordsAreEqual()) {
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

/**
 * starts the signup animation, resets the form and after a short delay pipes to the login page
 */
function pipeToLogin() {
    startSignupAnimation();
    resetForm();
    setTimeout(() => window.open('login.html', '_self'), 800);
}

/**
 * resets the inputs of the signup form
 */
function resetForm() {
    userName.value = '';
    email.value = '';
    confirmPassword.value = '';
    password.value = '';

}

/**
 * checks if both passwords are strict equal and depending on the result returns true or false
 * 
 * @returns boolean
 */
function checkIfPasswordsAreEqual() {
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');

    if (password.value === confirmPassword.value) {
        return true;
    }
    else {
        wrongPasswordText();
        return false;
    }
}

/**
 * Checks if the checkbox for the privacyPolicy is checked, if so it removes the buttons disabled attribute and 
 * gives it a class with hover
 */
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

/**
 * starts the signup animation
 */
function startSignupAnimation() {
    document.getElementById('signupSuccessful').classList.add('signup-succesful-animation');
}

/**
 * if the passwords are wrong, displays the wrong password text
 */
function wrongPasswordText() {
    document.getElementById('wrongPasswordText').classList.remove('hide');
}