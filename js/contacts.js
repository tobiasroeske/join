let contacts = [
    {
        name: 'max mustermann',
        email: 'max.mustermann@gmail.com',
        phone: '+49 157789562',
        color: 'red'
    },
    {
        name: 'Tobias Roeske',
        email: 'roeske.tobias@gmail.com',
        phone: '+49 155589562',
        color: 'green'
    },
    {
        name: 'Bünyamin Fajrer',
        email: 'fajrer@gmx.de',
        phone: '+49 1577895562',
        color: 'darkblue'
    },
    {
        name: 'Erekle Toedten',
        email: 'erekleantidze@gmail.com',
        phone: '+49 157789562',
        color: 'purple'
    },
];

let colors = ['orange', 'purple', 'pink', 'yellow', 'green', 'darkblue', 'violet', 'red'];

/**
 * renders the sorted contacts array into the contact list 
 */
function renderContacts () {
    let contactList = document.getElementById('contacts');
    contactList.innerHTML = '';
    sortContactsByName();
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        contactList.innerHTML += generateContactBoxHTML(contact, i);
    }
}

/**
 * 
 * @param {*} contact 
 * @param {*} index 
 * @returns 
 */
function generateContactBoxHTML(contact, index) {
    return /*html*/`
        <div class=contact-box id="contactBox${index}">
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