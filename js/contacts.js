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
    {
        name: 'Benedikt Wittmann',
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
    startAnimation();
}

function startAnimation() {
    let animationObejct = document.getElementById('contactCreated');
    animationObejct.classList.add('contact-created-animation');
    setTimeout(() => {
        animationObejct.classList.remove('contact-created-animation')
    }, 2000)
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

async function renderContact(index) {
    resetContactContainer();
    let contactCard = document.getElementById('contactCard');
    let contact = contacts[index];
    contactCard.innerHTML = generateContactCardHTML(contact, index);
    setTimeout(() => contactCard.classList.add('contact-card-animation'), 125);
}

function resetContactContainer() {
    let contactCard = document.getElementById('contactCard');
    contactCard.innerHTML = '';
    contactCard.classList.remove('contact-card-animation');
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
    let initials = words.map(word => word.charAt(0)).toString().replace(',', '');
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

function sortContactsByName() {
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