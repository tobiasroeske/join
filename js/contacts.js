let contacts = [
    {
        name: 'max mustermann',
        email: 'max.mustermann@gmail.com',
        phone: '+49 157789562',
        color: 'red',
        id: 0
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
        id: 2
    },
    {   name: 'Benedikt Wittmann',
        email: 'witti.b@web.de',
        phone: '+49163587654',
        color: 'yellow',
        id: 3
    },
    {
        name: 'Erekle Toedten',
        email: 'erekleantidze@gmail.com',
        phone: '+49 157789562',
        color: 'purple',
        id: 4
    },
];

let colors = ['orange', 'purple', 'pink', 'yellow', 'green', 'darkblue', 'violet', 'red'];
let firstLetters = [];

function init() {
    getFirstLetters();
    renderContactList();
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
        <div class=contact-box id="contactBox${index}" onclick="showContact(${index}); changeContactToActive('contactBox${index}')">
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

function showContact(index) {
    let contactCard = document.getElementById('contactCard');
    let contact = contacts[index];
    contactCard.innerHTML = generateContactCardHTML(contact);
}

function generateContactCardHTML(contact) {
    return /*html*/`
        <div class="contact-heading">
            <div class="name-initials ${contact['color']}" id="nameInitials">${getInitials(contact['name'])}</div>
            <div class="contact-heading-content">
                <span class="cotact-name" id="contactName">${capitalizeFirstLetter(contact['name'])}</span>
                    <div class="edit-contact">
                        <div id="editContact"><img src="assets/img/contacts_edit.svg" alt="edit icon"> Edit</div>
                        <div id="deleteContact"><img src="assets/img/contacts_delete.svg" alt="delete icon"> Delete</div>
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