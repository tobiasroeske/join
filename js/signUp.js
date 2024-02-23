let users = [];

async function init(){
    loadUsers();
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
    let confirmPassword = document.getElementById('confirmPassword');

    if(matchPass()) {
        users.push({
            name: userName.value,
            password: password.value,
            email: email.value,
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
        confirmPassword.classList.remove('input-box-');
        confirmPassword.classList.add('password-box-red--focused');
        alert("password must be same!");  
        return false;  
        }  
}