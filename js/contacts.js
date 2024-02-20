let contacts = [
    {
        name: 'max mustermann',
        email: 'max.mustermann@gmail.com',
        phone: '+49 157789562',
        color: 'red',
    },
    {
        name: 'Tobias Roeske',
        email: 'roeske.tobias@gmail.com',
        phone: '+49 155589562',
        color: 'green',
        id: 1
    },
    {
        name: 'Bünyamin Fajrer',
        email: 'fajrer@gmx.de',
        phone: '+49 1577895562',
        color: 'darkblue',
    },
    {   name: 'Benedikt Wittmann',
        email: 'witti.b@web.de',
        phone: '+49163587654',
        color: 'yellow',
    },
    {
        name: 'Erekle Toedten',
        email: 'erekleantidze@gmail.com',
        phone: '+49 157789562',
        color: 'purple',
    },
];

let colors = ['orange', 'purple', 'pink', 'yellow', 'green', 'darkblue', 'violet', 'red'];
let firstLetters = [];

async function init() {
    await loadContacts()
    getFirstLetters();
    renderContactList();
}

async function loadContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
    } catch (error) {
        console.error('Loading error:', error);
    }
    
}

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

async function addNewContact() {
    let nameInput = document.getElementById('nameInput');
    let emailInput = document.getElementById('emailInput');
    let phoneInput = document.getElementById('phoneInput');
    contacts.push({
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        color: getRandomColor()
    });
    await setItem('contacts', JSON.stringify(contacts));
    init();
    togglePopup('popup');
}


function renderContactBoxes(firstLetter) {
    let html = '';
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        if (contact['name'].toLocaleUpperCase().charAt(0) == firstLetter) {
            html += generateContactBoxHTML(contact, i);
        }
    }
    return html;
}

function generateContactBoxHTML(contact, index) {
    return /*html*/`
        <div class=contact-box id="contactBox${index}" onclick="renderContact(${index}); changeContactToActive('contactBox${index}')">
                <div class="initials ${contact['color']}">
                    <span>${getInitials(contact['name'])}</span>
                </div>
                <div class="contact-info-in-list">
                    <span class="contact-info-name">${capitalizeFirstLetter(contact['name'])}</span>
                    <span class="contact-email">${contact['email']}</span>
                </div>
            </div>
    `;
}

function renderContact(index) {
    let contactCard = document.getElementById('contactCard');
    let contact = contacts[index];
    contactCard.innerHTML = generateContactCardHTML(contact, index);
}

async function deleteContact(index) {
    contacts.splice(index, 1);
    await setItem('contacts', JSON.stringify(contacts));
    document.getElementById('contactCard').innerHTML = '';
    init();
}

function renderContactEditor(index) {
    let popup = document.getElementById('popup');
    let contact = contacts[index];
    popup.innerHTML = generateContactEditorHTML(contact, index);
    togglePopup('popup');
}

function renderAddNewContactEditor() {
    let popup = document.getElementById('popup');
    popup.innerHTML = generateNewContactEditorHTML();
    togglePopup('popup');
}


async function editContact(index) {
    let name = document.getElementById('nameInput');
    let email = document.getElementById('emailInput');
    let phone = document.getElementById('phoneInput');
    contacts[index]['name'] = name.value;
    contacts[index]['email'] = email.value;
    contacts[index]['phone'] = phone.value;
    togglePopup('popup');
    updateContacts(index, 'contacts', JSON.stringify(contacts))
}

async function updateContacts(index, key, value) {
    renderContact(index);
    await setItem(key, value);
    init();
}

function generateNewContactEditorHTML() {
    return /*html*/`
        <div class="new-contact-container" id="newContact">
            <div class="add-contact-left">
                <div class="contact-join-logo"> <img src="assets/img/contact_logo.svg" alt="join logo"></div>
                <h1 class="page-heading">Add contact</h1>
                <span class="special-subheading">Tasks are better with a team!</span>
            </div>
            <div class="add-contact-right">
                <img src="assets/img/contacts_close.svg" alt="close icon" class="icon close-icon"
                    onclick="togglePopup()">
                <img src="assets/img/contact_contact_img.svg" alt="">
                <form onsubmit="addNewContact(); return false;" class="contact-form">
                    <div class="input-container">
                        <div class="input-field">
                            <input type="text" name="" id="nameInput" placeholder="Name" class="special-input">
                            <img src="assets/img/contacts_person.svg" alt="">
                        </div>
                    </div>

                    <div class="input-field">
                        <input type="email" name="" id="emailInput" placeholder="Email" class="special-input">
                        <img src="assets/img/contacts_call.svg" alt="">
                    </div>
                    <div class="input-field">
                        <input type="tel" name="" id="phoneInput" placeholder="Phone" class="special-input">
                        <img src="assets/img/contacts_call.svg" alt="">
                    </div>
                    <div class="contact-submit-field">
                        <div class="submit-btn clear-btn" onclick="togglePopup()">Cancel<img
                                src="assets/img/contacts_close.svg" alt=""></div>
                        <button class="submit-btn add-btn" >Create contact <img src="assets/img/check_icon.svg"
                                alt=""></button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function generateContactEditorHTML(contact, index) {
    return /*html*/`
        <div class="new-contact-container" id="editContact">
            <div class="add-contact-left">
                <div class="contact-join-logo"> <img src="assets/img/contact_logo.svg" alt="join logo"></div>
                <h1 class="page-heading">Edit Contact</h1>
            </div>
            <div class="add-contact-right">
                <img src="assets/img/contacts_close.svg" alt="close icon" class="icon close-icon"
                    onclick="togglePopup()">
                <img src="assets/img/contact_contact_img.svg" alt="">
                <form onsubmit="editContact(${index}); return false;" class="contact-form">
                    <div class="input-container">
                        <div class="input-field">
                            <input type="text" name="" id="nameInput" placeholder="Name" class="special-input" value="${contact['name']}">
                            <img src="assets/img/contacts_person.svg" alt="">
                        </div>
                    </div>

                    <div class="input-field">
                        <input type="email" name="" id="emailInput" placeholder="Email" class="special-input" value="${contact['email']}">
                        <img src="assets/img/contacts_call.svg" alt="">
                    </div>
                    <div class="input-field">
                        <input type="tel" name="" id="phoneInput" placeholder="Phone" class="special-input" value="${contact['phone']}">
                        <img src="assets/img/contacts_call.svg" alt="">
                    </div>
                    <div class="contact-submit-field">
                        <div class="submit-btn clear-btn" onclick="deleteContact(${index})">Delete<img
                                src="assets/img/contacts_close.svg" alt=""></div>
                        <button class="submit-btn add-btn">Save <img src="assets/img/check_icon.svg"
                                alt=""></button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function generateContactCardHTML(contact, index) {
    return /*html*/`
        <div class="contact-heading">
            <div class="name-initials ${contact['color']}" id="nameInitials">${getInitials(contact['name'])}</div>
            <div class="contact-heading-content">
                <span class="cotact-name" id="contactName">${capitalizeFirstLetter(contact['name'])}</span>
                    <div class="edit-contact">
                        <div id="editContact" onclick="renderContactEditor(${index})"><img src="assets/img/contacts_edit.svg" alt="edit icon"> Edit</div>
                        <div id="deleteContact" onclick="deleteContact(${index})"><img src="assets/img/contacts_delete.svg" alt="delete icon"> Delete</div>
                    </div>
            </div>
        </div>

        <span class="contact-information">Contact Information</span>

        <div class="contact-info-box">
            <div class="info-box">
                <span class="bold">Email</span>
                <span class="contact-email" id="contactEmail">${contact['email']}</span>
            </div>

            <div class="info-box">
                <span class="bold">Phone</span>
                <span>${contact['phone']}</span>
            </div>
        </div>
    `
}

function getFirstLetters() {
    firstLetters = [];
    sortContactsByName();
    contacts.forEach(contact => {
        let firstLetter = contact.name.charAt(0).toUpperCase();
        if (!firstLetters.includes(firstLetter)) {
            firstLetters.push(firstLetter);
        }
    })
}

function getInitials(name) {
    let words = name.split(' ');
    let initials = words.map(word => word.charAt(0)).toString().replace(',','');
    initials = initials.toUpperCase()
    return initials;
}

function capitalizeFirstLetter(string) {
    let words = string.split(' ');
    let capitalizedString = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).toString().replace(',', ' ');
    return capitalizedString;
}

function getRandomColor() {
    let randomIndex = Math.floor(Math.random() * colors.length);
    let randomColor = colors[randomIndex];
    return randomColor;
}

function sortContactsByName () {
    return contacts.sort((a, b) => {
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

function changeContactToActive(id) {
    let activeContact = document.getElementById(id);
    let contacts = document.getElementsByClassName('contact-box');
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        contact.classList.remove('active-contact');
    }
    activeContact.classList.add('active-contact');
}

function togglePopup() {
    document.getElementById('popup').classList.toggle('d-none');
}