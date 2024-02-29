let contacts = [];

let tasks = [];
let currentTask = {}
let currentPriority = ['medium', 'assets/img/addTask_medium_orange.svg'];
let assignedContact;
let selectedContacts = [];
let subtasks = [];
let currentColumn = 'toDo';

async function initAddTask() {
    await includeHTML();
    await generateLoadingScreen();
    renderContacts();
}

async function generateLoadingScreen() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = generateSpinnerHTML();
    await load();
}

async function load() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
        tasks = JSON.parse(await getItem('tasks'));
    } catch (error) {
        console.error('Loading error:' + error);
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
            <li class="list-item" id="contact${i}" onclick="stopCurrentAction(event); selectContact('contact${i}', ${i})">
                <div class="flex gap-8 align-items-center">
                    <div class="initials ${contact['color']}">${contact['initials']}</div>
                    <span>${contact['name']}</span>
                </div>
                <input type="checkbox" id="contact${i}">
            </li>
        `;
    }
}

function selectContact(id, index) {
    let selectedContact = document.getElementById(id);
    if (!selectedContact.classList.contains('active-contact')) {
        selectedContact.classList.add('active-contact');
        document.getElementById(id).querySelector('input').checked = true;
        addContactToList(index)
    } else {
        selectedContact.classList.remove('active-contact')
        document.getElementById(id).querySelector('input').checked = false;
        removeContactFromList(index);
    }
}

function addContactToList(index) {
    selectedContacts.push(contacts[index]);
    renderSelectedContacts()
}

function removeContactFromList(index) {
    let contact = contacts[index];
    let newIndex = selectedContacts.indexOf(contact);
    selectedContacts.splice(newIndex, 1);
    renderSelectedContacts();
}

function renderSelectedContacts() {
    let selecetedContactsContainer = document.getElementById('selectedContacts');
    selecetedContactsContainer.innerHTML = '';
    for (let i = 0; i < selectedContacts.length; i++) {
        const contact = selectedContacts[i];
        selecetedContactsContainer.innerHTML += /*html*/`
            <div class="initials ${contact['color']}">${contact['initials']}</div>
        `
    }
}

function generateSpinnerHTML() {
    return /*html*/`
        <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `
}

async function createNewTask() {
    getTaskData();
    tasks.push(currentTask);
    await setItem('tasks', JSON.stringify(tasks));
    resetAddTask();
    pipeToBoard();
}

function getTaskData() {
    let titleInput = document.getElementById('titleInput');
    let descriptionInput = document.getElementById('descriptionTextarea');
    let selectedContactContainer = document.getElementById('selectedContacts');
    let dateInput = document.getElementById('dateInput');
    let categoryInput = document.getElementById('categoryInput');
    currentTask = {
        title: titleInput.value,
        description: descriptionInput.value,
        assignedContact: selectedContacts,
        dueDate: dateInput.value,
        category: categoryInput.value,
        priority: currentPriority,
        column: currentColumn,
        subtasks: subtasks
    };
  }
  

function addPriorityToTask(prio, id) {
    let imageSource = document.getElementById(id).querySelector('img').src
    currentPriority = [];
    currentPriority.push(prio);
    currentPriority.push(imageSource);
}

function resetAddTask() {
    document.getElementById('titleInput').value = ''
    document.getElementById('descriptionTextarea').value = ''
    document.getElementById('assignedContacts').value = ''
    document.getElementById('dateInput').value = ''
    document.getElementById('categoryInput').value = ''
    currentTask = '';
    currentPriority = 'medium'
}

function togglePopup(id) {
    document.getElementById(id).classList.toggle('d-none');
}

function closePopup(id) {
    document.getElementById(id).classList.add('d-none');
}

function addCategory(id) {
    let inputField = document.getElementById('categoryInput');
    let listItem = document.getElementById(id);
    inputField.value = listItem.innerHTML;
    togglePopup('categoryPopup');
}

function startAnimation (id, className) {
    let element = document.getElementById(id);
    element.classList.toggle(className);
}

function pipeToBoard() {
    document.getElementById('createTaskBtn').disabled = true;
    document.getElementById('taskAdded').classList.remove('d-none');
    setTimeout(() => startAnimation('taskAdded', 'task-added-animation'), 125);
    setTimeout(() => window.open('board.html', '_self'),1500);
}

function toggleSubtaskInput() {
    document.getElementById('addSubtaskIcon').classList.toggle('d-none');
    document.getElementById('editSubtaskIcons').classList.toggle('d-none');
}

function addSubtask() {
    let subtaskInput = document.getElementById('subtaskInput');
    if (subtaskInput.value != '') {
    subtasks.push(subtaskInput.value)
    renderSubtasks();
    subtaskInput.value = '';
    };
    togglePopup('addSubtaskIcon');
    togglePopup('editSubtaskIcons');
}

function closeAllPopupsInAddTask() {
    document.getElementById('contactsPopup').classList.add('d-none');
    document.getElementById('categoryPopup').classList.add('d-none');
    document.getElementById('editSubtaskIcons').classList.add('d-none');
    document.getElementById('addSubtaskIcon').classList.remove('d-none');
}

function callOnEnterPress(event, id) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById(id).click();
    }
}

function clearInput(id) {
    document.getElementById(id).value = '';
    togglePopup('addSubtaskIcon');
    togglePopup('editSubtaskIcons');
}

function deleteSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
}

function renderSubtasks() {
    let subtaskContainer = document.getElementById('subtasks');
    subtasks.length == 0 ? subtaskContainer.classList.add('d-none') : subtaskContainer.classList.remove('d-none');
    subtaskContainer.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        subtaskContainer.innerHTML += generateSubtaskHTML(subtask, i);
    }
}

function openSubtaskEditor(index) {
    let input = document.getElementById(`subtask${index}`);
    input.classList.remove('subtask-list-item');
    input.classList.add('subtask-item-edit');
    input.innerHTML = /*html*/`
        <div class="subtask-input-field">
            <input type="text" value="${subtasks[index]}" class="edit-subtask-input" id="subtaskInput${index}" onkeypress="callOnEnterPress(event, 'editSubtaskBtn')">
            <div class="edit-icons">
                <img src="assets/img/addTask_delete.svg" alt="" onclick="deleteSubtask(${index})" >
                <div class="icon-seperator"></div>
                <img src="assets/img/addTask_check.svg" alt="" onclick="editSubtask(${index})" id="editSubtaskBtn">
            </div>
        </div>
    `;
}

function editSubtask(index) {
    let edit = document.getElementById(`subtaskInput${index}`);
    subtasks.splice(index, 1, edit.value);
    renderSubtasks();
}

function generateSubtaskHTML(subtask, index) {
    return /*html*/`
    <div class="subtask-list-item" id="subtask${index}" ondblclick="openSubtaskEditor(${index})">
        <li>${subtask}</li>
        <div class="edit-icons">
            <img src="assets/img/addTask_edit.svg" alt="" onclick="openSubtaskEditor(${index})">
            <div class="icon-seperator"></div>
            <img src="assets/img/addTask_delete.svg" alt="" onclick="deleteSubtask(${index})">
        </div>
    </div>
`;
}

