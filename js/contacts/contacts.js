
let colors = ['orange', 'purple', 'pink', 'yellow', 'green', 'darkblue', 'violet', 'red'];
let firstLetters = [];

/**
 * resets the currentUser, loads the data from the server, checks if the user is logged in, 
 * then gets the first letters for the initials and renders the contactList
 */
async function init() {
    resetCurrentUser();
    await load()
    checkIfLoggedIn();
    getFirstLetters();
    renderContactList();
}

/**
 * gets different data from the contacts array and renders the contact list
 */
function renderContactList() {
    let contactList = document.getElementById('contacts');
    contactList.innerHTML = '';
    for (let i = 0; i < firstLetters.length; i++) {
        const firstLetter = firstLetters[i];
        contactList.innerHTML += /*html*/`
            <div class="first-letter-field" id="box${firstLetter}">
                ${firstLetter}
            </div>
            ${renderContactBoxes(firstLetter)}
        `;
    }
}

/**
 * gets the information from the input fields and adds a new contact to the contacts array
 * then it reloads the contact list and updateds the contact container
 */
async function addNewContact() {
    let nameInput = document.getElementById('nameInput');
    let emailInput = document.getElementById('emailInput');
    let phoneInput = document.getElementById('phoneInput');
    let contact = {
        name: capitalizeFirstLetter(nameInput.value), 
        email: emailInput.value,
        phone: phoneInput.value,
        color: getRandomColor(),
        initials: getInitials(nameInput.value)
    }
    currentUser['contacts'].push(contact);
    saveCurrentUser();
    await updateUsers();
    getFirstLetters();
    renderContactList();
    updateContactContainer(contact);
}

/**
 * updates the contact container and starts the contact created animation
 * 
 * @param {object} contact one contact object from the contacts array
 */
function updateContactContainer(contact) {
    let index = getIndexOfContact(contact);
    renderContact(index);
    togglePopup('popup');
    setTimeout(() => startContactCreatedAnimation(), 125);
}

/**
 * gets the index of the current contact which is needed to render the contact
 * 
 * @param {object} contact one contact object from the contacts array
 * @returns the index of the current contact
 */
function getIndexOfContact(contact) {
    let index;
    sortContactsByName();
    for (let i = 0; i < currentUser['contacts'].length; i++) {
        const contactName = currentUser['contacts'][i]['name'];
        if (contactName == contact['name']) {
            index = i
        }
    }
    return index;
}

/**
 * starts the contact created animation, after 2s it restarts to make the button disapear
 */
function startContactCreatedAnimation() {
    let animationObejct = document.getElementById('contactCreated');
    animationObejct.classList.add('contact-created-animation');
    setTimeout(() => {
        animationObejct.classList.remove('contact-created-animation')
    }, 2000)
}

/**
 * checks and sorts the contacts depending on their first letter and renders the contact boxes of the contact list
 * 
 * @param {string} firstLetter the letter the contact name starts with
 * @returns returns the html code for the contact boxes
 */
function renderContactBoxes(firstLetter) {
    let html = '';
    for (let i = 0; i < currentUser['contacts'].length; i++) {
        const contact = currentUser['contacts'][i];

        if (contact['name'].toLocaleUpperCase().charAt(0) == firstLetter) {
            html += generateContactBoxHTML(contact, i);
        }
    }
    return html;
}

/**
 * resets the contact container and checks the size of the current window and depending on the result 
 * renders the contact container with the contact information and starts the contact animation
 * 
 * @param {number} index the index number of the contact in the contacts array
 */
async function renderContact(index) {
    resetContactContainer();
    checkScreenSize();
    let contactCard = document.getElementById('contactCard');
    let contact = currentUser['contacts'][index];
    contactCard.innerHTML = generateContactCardHTML(contact, index);
    setTimeout(() => contactCard.classList.add('contact-card-animation'), 125);
}

/**
 * empties the contact container and restarts the contact animation
 */
function resetContactContainer() {
    let contactCard = document.getElementById('contactCard');
    contactCard.innerHTML = '';
    contactCard.classList.remove('contact-card-animation');
}

/**
 * starts the slide in animation for the buttons
 * 
 * @param {string} id the id where the animation should start on
 * @param {string} className the class name of the animation class 
 */
function startSlideInAnimation(id, className) {
    let element = document.getElementById(id);
    element.classList.toggle(className);
}

/**
 * deletes the contact from the contacts array sends the new array to the remote storage and empties the 
 * contact container. After that reloads the contact list
 * 
 * @param {number} index index of the current contact in the contacts array
 */
async function deleteContact(index) {
    currentUser['contacts'].splice(index, 1);
    saveCurrentUser();
    await updateUsers();
    document.getElementById('contactCard').innerHTML = '';
    getFirstLetters();
    renderContactList();
}

/**
 * opens the popup for the editor and renders the html of the editor
 * starts a slide animation for the editor
 * 
 * @param {number} index index of the current contact in the contacts array
 */
function renderContactEditor(index) {
    let popup = document.getElementById('popup');
    let contact = currentUser['contacts'][index];
    popup.innerHTML = generateContactEditorHTML(contact, index);
    togglePopup('popup');
    setTimeout(() => startSlideInAnimation('editContact', 'new-contact-animation'), 125);
}

/**
 * opens the popup for the editor and renders the add new contact editor
 * starts a slide animation for the editor
 */
function renderAddNewContactEditor() {
    let popup = document.getElementById('popup');
    popup.innerHTML = generateNewContactEditorHTML();
    togglePopup('popup');
    setTimeout(() => startSlideInAnimation('newContact', 'new-contact-animation'), 125);
}

/**
 * takes the new values of the input fields and saves them to the current contact object
 * then updates the contact container as well as the contact list
 * 
 * @param {number} index index of the current contact in the contacts array
 */
async function editContact(index) {
    let name = document.getElementById('nameInput');
    let email = document.getElementById('emailInput');
    let phone = document.getElementById('phoneInput');
    currentUser['contacts'][index]['name'] = name.value;
    currentUser['contacts'][index]['email'] = email.value;
    currentUser['contacts'][index]['phone'] = phone.value;
    togglePopup('popup');
    saveCurrentUser();
    updateContacts(index, 'users', JSON.stringify(users))
    renderContact(index);
}

/**
 * renders the contact container, updates the remotely saved contacts array
 * and reloads the contact list
 * 
 * @param {number} index index of the current contact in the contacts array
 * @param {string} key the key of saved in the remote storage, here 'contacts'
 * @param {string} value the content saved in the remote storage, here the contant of 'contacts'
 */
async function updateContacts(index, key, value) {
    renderContact(index);
    await setItem(key, value);
    getFirstLetters();
    renderContactList();
}

/**
 * sorts the array by name and pushes the first letter of each name to the firstLetters array
 * (only if it is not already in the array)
 */
function getFirstLetters() {
    firstLetters = [];
    sortContactsByName();
    currentUser['contacts'].forEach(contact => {
        let firstLetter = contact.name.charAt(0).toUpperCase();
        if (!firstLetters.includes(firstLetter)) {
            firstLetters.push(firstLetter);
        }
    })
}

/**
 * takes a string and creates an array with each word as elements
 * takes from each word the first letter and capitalizes it, deletes the small first letter and rebuilds the word
 *
 * 
 * @param {string} string any string
 * @returns returns the same string with the first letters capitalized
 */
function capitalizeFirstLetter(string) {
    let words = string.split(' ');
    let capitalizedString = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).toString().replace(',', ' ');
    return capitalizedString;
}

/**
 * creates a random index, which is used to get a random color from the colors array
 * 
 * @returns random color from the colors array
 */
function getRandomColor() {
    let randomIndex = Math.floor(Math.random() * colors.length);
    let randomColor = colors[randomIndex];
    return randomColor;
}

/**
 * sorts the contacts array by name 
 * does not override the original contacts array
 * 
 * @returns the sorted array, which can be used to render the contact list,
 */
function sortContactsByName() {
    currentUser['contacts'].sort((a, b) => {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toLocaleUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    })
}

/**
 * removes all existing active classes after that gives the selected element the active class
 * 
 * @param {string} id the id of the element which should be changed to active
 */
function changeContactToActive(id) {
    let activeContact = document.getElementById(id);
    let contacts = document.getElementsByClassName('contact-box');
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        contact.classList.remove('active-contact');
    }
    activeContact.classList.add('active-contact');
}

/**
 * toggles an elements 'd-none' class
 * 
 * @param {string} id element which class should be toggled
 */
function togglePopup(id) {
    document.getElementById(id).classList.toggle('d-none');
}

/**
 * starts the slide in animation and after 125ms gives the popup the class 'd-none'
 * 
 * @param {string} animationId the element on which the animation starts on
 * @param {string} popupId the element which gets the class d-none 
 */
function closePopupAndStartAnimation(animationId, popupId) {
    startSlideInAnimation(animationId, 'new-contact-animation');
    setTimeout(() => document.getElementById(popupId).classList.add('d-none'), 125);
}

/**
 * used to stop other functions to execute
 * 
 * @param {event} event the event which is fired
 */
function stopOtherActions(event) {
    event.stopPropagation();
}
/**
 * opens a popup for the mobile version do show the options do edit or delete contacts
 * starts the slide in animation for the popup
 */
function openContactOptionPopup() {
    setTimeout(() => startSlideInAnimation('contactOptionsPopup', 'contact-options-popup-animation'), 125);
}

/**
 * checks if the is already created, if so it closes the popup starting again with the slide animation
 */
function closeContactOptionsPopup() {
    if (document.getElementById('contactOptionsPopup') != null) {
        document.getElementById('contactOptionsPopup').classList.remove('contact-options-popup-animation')
    }
}

/**
 * closes the current contact container in the mobile view
 */
function closeContact() {
    document.getElementById('contactContent').classList.toggle('d-flex');
    document.getElementById('contactLeftside').classList.toggle('d-none');
}

/**
 * checks the screen size and changes the visability of the contact container and the 
 * contact list, only used for mobile version 
 * after calling rechecks the screen width on resizing
 */
function checkScreenSize() {
    if (window.innerWidth <= 850) {
        document.getElementById('contactContent').classList.add('d-flex');
        document.getElementById('contactLeftside').classList.add('d-none');
    }
    recheckScreenSize();
}

/**
 * double checks the screen size on every resize event and depending on the width it changes the visability of the 
 * contact container and the contact list
 * only mobile versions
 */
function recheckScreenSize() {
    window.addEventListener('resize', () => {
        if (window.innerWidth > 850) {
            document.getElementById('contactLeftside').classList.remove('d-none');
        }
        if (window.innerWidth <= 850) {
            document.getElementById('contactContent').classList.add('d-flex');
            document.getElementById('contactLeftside').classList.add('d-none');
        }
    });
}