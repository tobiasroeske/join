//const STORAGE_TOKEN = 'BIBQMWMDY19NJ5KHLZZHSPZ7CLE62T2J4AEWY50R';
const STORAGE_TOKEN = 'PNDNIMRQBN4IFO1LN7HPQ6C2GGFJW41V23EIQFW9';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const BASE_URL = 'https://join-b0909-default-rtdb.europe-west1.firebasedatabase.app/';

/**
 * saves the key and its value on the remote storage
 * 
 * @param {string} key the key which shall be saved
 * @param {object} value the value of the key
 * @returns 
 */
async function setItem(path, item) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
    })
    let responseAsJson = await response.json();
    return responseAsJson;
}

/**
 * tries to load the key from the remote storage, if it does not exist gives out error message
 * 
 * @param {string} key the name of the key
 * @returns 
 */
async function getItem(path) {
    let response = await fetch(BASE_URL + path + '.json');
    let responseAsJson = await response.json();
    return responseAsJson;
}

async function getAllUsers() {
    let allUsers = await getItem('users');
    return allUsers;
}

async function getUsersArray() {
    let users = [];
    let allUsers = await getAllUsers();
    let allUserKeys = Object.keys(allUsers);
    allUserKeys.forEach((u, i) => {
        let user = allUsers[allUserKeys[i]];
        user = setTaskObject(user);
        user.id = u;
        
        users.push(user)
    })
    console.log(users);
    return users;
}

function setTaskObject(user) {
    if (!user.tasks) {
        user.tasks = [];
    } else {
        user.tasks.forEach(t => {
            if (!t.subtasks) {
                t.subtasks = [];
            }  
            if (!t.assignedContacts) {
                t.assignedContacts = []
            }
        })
    }
    return user;
}

async function updateSingleUser(id, data) {
    let response = await fetch(BASE_URL + `/users/${id}` + '.json', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    let responseAsJson = await response.json();
}

/**
 * saves the guest object to the local storage for the guest login
 */
function saveGuestToLocalStorage() {
    localStorage.setItem('guest', JSON.stringify(guest));
}

/**
 * if the guest key exists loads it from the local storage
 */
function loadGuestFromLocalStorage() {
    let guestAsText = JSON.parse(localStorage.getItem('guest'));
    if (guestAsText) {
        guest = guestAsText;
    }
}