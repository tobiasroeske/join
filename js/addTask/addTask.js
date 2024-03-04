let contacts = [];
let tasks = [];
let currentTask = {
    currentPriority: ['medium', 'assets/img/addTask_medium_orange.svg'],
    assignedContacts: [],
    currentColumn: 'toDo',
    category: '',
    subtasks: [],
    title: '',
    description: '',
    dueDate: ''
};

async function initAddTask() {
    await includeHTML();
    await load();
    renderContacts();
}

async function load() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
        tasks = JSON.parse(await getItem('tasks'));
    } catch (error) {
        console.error('Loading error:' + error);
    }
}

function renderContacts() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        contactList.innerHTML += generateContactListHTML(contact, i);
    }
}

async function addTask() {
    getTaskData();
    tasks.push(currentTask);
    await setItem('tasks', JSON.stringify(tasks));
    resetAddTask();
    pipeToBoard();
}

function getTaskData() {
    let titleInput = document.getElementById('titleInput');
    let descriptionInput = document.getElementById('descriptionTextarea');
    let dateInput = document.getElementById('dateInput');
    currentTask['title'] = titleInput.value;
    currentTask['description'] = descriptionInput.value;
    currentTask['dueDate'] = dateInput.value;
}

function resetAddTask() {
    document.getElementById('titleInput').value = ''
    document.getElementById('descriptionTextarea').value = ''
    document.getElementById('assignedContacts').value = ''
    document.getElementById('dateInput').value = ''
    document.getElementById('categoryInput').value = ''
    resetCurrentTask();
}

function resetCurrentTask() {
    currentTask = {
        currentPriority: ['medium', 'assets/img/addTask_medium_orange.svg'],
        assignedContacts: [],
        currentColumn: 'toDo',
        category: '',
        subtasks: [],
        title: '',
        description: '',
        dueDate: ''
    };
}

function pipeToBoard() {
    document.getElementById('createTaskBtn').disabled = true;
    document.getElementById('taskAdded').classList.remove('d-none');
    setTimeout(() => startAnimation('taskAdded', 'task-added-animation'), 125);
    setTimeout(() => window.open('board.html', '_self'), 1500);
}

function startAnimation(id, className) {
    let element = document.getElementById(id);
    element.classList.toggle(className);
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

function addPriorityToTask(prio, id) {
    let imageSource = document.getElementById(id).querySelector('img').src
    currentTask['currentPriority'] = [];
    currentTask['currentPriority'].push(prio);
    currentTask['currentPriority'].push(imageSource);
}

function addCategory(id) {
    let inputField = document.getElementById('categoryInput');
    let listItem = document.getElementById(id);
    inputField.value = listItem.innerText;
    currentTask['category'] = listItem.innerText;
    togglePopup('categoryPopup');
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
    currentTask['assignedContacts'].push(contacts[index]);
    renderSelectedContacts('selectedContacts')
}

function removeContactFromList(index) {
    let contact = contacts[index];
    let newIndex = currentTask['assignedContacts'].indexOf(contact);
    currentTask['assignedContacts'].splice(newIndex, 1);
    renderSelectedContacts('selectedContacts');
}

function renderSelectedContacts(id) {
    let selecetedContactsContainer = document.getElementById(id);
    selecetedContactsContainer.innerHTML = '';
    for (let i = 0; i < currentTask['assignedContacts'].length; i++) {
        const contact = currentTask['assignedContacts'][i];
        selecetedContactsContainer.innerHTML += /*html*/`
            <div class="initials ${contact['color']}">${contact['initials']}</div>
        `
    }
}
function renderSubtasks() {
    let subtaskContainer = document.getElementById('subtasks');
    currentTask['subtasks'].length == 0 ? subtaskContainer.classList.add('d-none') : subtaskContainer.classList.remove('d-none');
    subtaskContainer.innerHTML = '';
    for (let i = 0; i < currentTask['subtasks'].length; i++) {
        const subtask = currentTask['subtasks'][i]['subtaskName'];
        subtaskContainer.innerHTML += generateSubtaskHTML(subtask, i);
    }
}

function addSubtask() {
    let subtaskInput = document.getElementById('subtaskInput');
    if (subtaskInput.value != '') {
        currentTask['subtasks'].push({subtaskName: subtaskInput.value, 'done': false})
        renderSubtasks();
        subtaskInput.value = '';
    };
    toggleSubtaskInput();
}

function openSubtaskEditor(index) {
    let input = document.getElementById(`subtask${index}`);
    input.classList.remove('subtask-list-item');
    input.classList.add('subtask-item-edit');
    input.innerHTML = generateSubTaskEditorHTML(index);
}

function deleteSubtask(index) {
    currentTask['subtasks'].splice(index, 1);
    renderSubtasks();
}

function editSubtask(index) {
    let edit = document.getElementById(`subtaskInput${index}`);
    currentTask['subtasks'][index]['subtaskName'] = edit.value;
    renderSubtasks();
}

function toggleSubtaskInput() {
    togglePopup('addSubtaskIcon');
    togglePopup('editSubtaskIcons');
}

function togglePopup(id) {
    document.getElementById(id).classList.toggle('d-none');
}

function closePopup(id) {
    document.getElementById(id).classList.add('d-none');
}

function clearInput(id) {
    document.getElementById(id).value = '';
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

function generateContactListHTML(contact, i) {
    return /*html*/`
    <li class="list-item" id="contact${i}" onclick="stopCurrentAction(event); selectContact('contact${i}', ${i})">
        <div class="flex gap-8 align-items-center">
            <div class="initials ${contact['color']}">${contact['initials']}</div>
            <span>${contact['name']}</span>
        </div>
        <input type="checkbox" id="contact${i}">
    </li>
`;
}

function generateSubTaskEditorHTML(index) {
    return /*html*/`
    <div class="subtask-input-field">
        <input type="text" value="${currentTask['subtasks'][index]['subtaskName']}" class="edit-subtask-input" id="subtaskInput${index}" onkeypress="callOnEnterPress(event, 'editSubtaskBtn')">
        <div class="edit-icons">
            <img src="assets/img/addTask_delete.svg" alt="" onclick="deleteSubtask(${index})" >
            <div class="icon-seperator"></div>
            <img src="assets/img/addTask_check.svg" alt="" onclick="editSubtask(${index})" id="editSubtaskBtn">
        </div>
    </div>
`;
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

