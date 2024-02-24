let contacts = [];

let tasks = [];
let currentTask;

async function init() {
    includeHTML();
    await loadContacts();
    renderContacts();
}

async function loadContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
    } catch (error) {
        console.error('Loading error:', error);
    }
}

function selectPriority(btnId, btnClass) {
    let allBtns = document.querySelectorAll('.prio-btn');
    allBtns.forEach(btn => {
        if (btn.id === btnId) {
            btn.classList.toggle(btnClass);
        } else {
            btn.classList.remove('urgent-btn', 'medium-btn', 'low-btn');
        }
    });
}

function renderContacts() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        contactList.innerHTML += /*html*/`
            <li id="contact${i}" onclick="addContactToList(${i})">${contact['name']}</li>
        `;
    }
}

async function createNewTask() {
    let titleInput = document.getElementById('titleInput');
    let descriptionInput = document.getElementById('descriptionTextarea');
    let contactInput = document.getElementById('assignedContacts');
    let dateInput = document.getElementById('dateInput');
    let categoryInput = document.getElementById('categoryInput');
    currentTask = {
        title: titleInput.value,
        description: descriptionInput.value,
        assignedContact: contactInput.value,
        dueDate: dateInput.value,
        category: categoryInput.value
    };
    tasks.push(currentTask);
    await setItem('tasks', JSON.stringify('tasks'));
}

function addContactToList(index) {
    let contactInputField = document.getElementById('assignedContacts')
    contactInputField.value = contacts[index]['name'];
    togglePopup('contactsPopup')
}

function togglePopup(id) {
    document.getElementById(id).classList.toggle('d-none');
}

function addCategory(id) {
    let inputField = document.getElementById('categoryInput');
    let listItem = document.getElementById(id);
    inputField.value = listItem.innerHTML;
    togglePopup('categoryPopup');
}

