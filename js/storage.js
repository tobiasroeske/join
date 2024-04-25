//const STORAGE_TOKEN = 'BIBQMWMDY19NJ5KHLZZHSPZ7CLE62T2J4AEWY50R';
const STORAGE_TOKEN = 'PNDNIMRQBN4IFO1LN7HPQ6C2GGFJW41V23EIQFW9';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * saves the key and its value on the remote storage
 * 
 * @param {string} key the key which shall be saved
 * @param {object} value the value of the key
 * @returns 
 */
async function setItem(key, value) {
    const payload = {key, value, token: STORAGE_TOKEN};
    return fetch(STORAGE_URL, {method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}

/**
 * tries to load the key from the remote storage, if it does not exist gives out error message
 * 
 * @param {string} key the name of the key
 * @returns 
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}"`;
    })
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