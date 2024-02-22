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
    let confirmPassword = document.getElementById('confirmPassword');

    if(matchPass()) {
        users.push({
            name: userName.value,
            password: password.value,
            confirmPassword: confirmPassword.value
        });
    }
    
    await setItem('users', JSON.stringify(users));
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