let users = [];

async function init(){
    loadUsers();
    acceptPolicy();
}

async function loadUsers(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e) {
        console.error('Loading error:', e);
    }
}

async function register () {
    let userName = document.getElementById('userName');
    let password = document.getElementById('password');
    let email = document.getElementById('email');

    if(matchPass()) {
        users.push({
            email: email.value,
            password: password.value,
            name: userName.value,
        });
    }
    
    await setItem('users', JSON.stringify(users)); // key = 'users', value
    resetForm();
}

function resetForm(){
    userName.value = '';
    email.value = '';
    confirmPassword.value = '';
    password.value = '';
    
}

function matchPass(){
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');

    if(password.value == confirmPassword.value){  
        return true;  
        }  
        else{
        alert("password must be same!");  
        return false;  
    }  
}

function acceptPolicy() {
    let acceptCheckbox = document.getElementById('checkbox');
    let signUpButton = document.querySelector('.sign-up-button button');

    acceptCheckbox.addEventListener('change', function(event) {
        if (event.target.checked) {
            signUpButton.disabled = false; // Aktiviert den "Sign up" Button
        } else {
            signUpButton.disabled = true; // Deaktiviert den "Sign up" Button
        }
    });
}