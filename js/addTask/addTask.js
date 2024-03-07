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

/**
 * loads the header and sidebar, then loads the currentUser and Users from the server
 * then renders the contacts in the contactList
 */
async function initAddTask() {
    await includeHTML();
    await load();
    renderContacts();
}

/**
 * gets the contacts saved in the contacts key of currentUser, 
 * then renders the contacts into the contactList
 */
function renderContacts() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    for (let i = 0; i < currentUser['contacts'].length; i++) {
        const contact = currentUser['contacts'][i];
        contactList.innerHTML += generateContactListHTML(contact, i);
    }
}

/**
 * Gets the task Data, then pushes the created task in the tasks array of currentUser
 * then disables the createTask button in case it takes some time to send the data to the server
 * then resets the form and pipes to the board page
 */
async function addTask() {
    getTaskData();
    currentUser['tasks'].push(currentTask);
    disableButton();
    await setItem('currentUser', JSON.stringify(currentUser));
    resetAddTask();
    pipeToBoard();
}

/**
 * disables addTask Button
 */
function disableButton() {
    let taskBtn = document.getElementById('createTaskBtn');
    taskBtn.disabled = true;
    taskBtn.classList.remove('hover-active');
}

/**
 * gets the data from the input and textarea fields and sets the keys
 * of currentTask
 */
function getTaskData() {
    let titleInput = document.getElementById('titleInput');
    let descriptionInput = document.getElementById('descriptionTextarea');
    let dateInput = document.getElementById('dateInput');
    currentTask['title'] = titleInput.value;
    currentTask['description'] = descriptionInput.value;
    currentTask['dueDate'] = dateInput.value;
}

/**
 * Resets the inputs and textarea, as well as the currentTask
 */
function resetAddTask() {
    document.getElementById('titleInput').value = ''
    document.getElementById('descriptionTextarea').value = ''
    document.getElementById('assignedContacts').value = ''
    document.getElementById('dateInput').value = ''
    document.getElementById('categoryInput').value = ''
    resetCurrentTask();
}

/**
 * resets currentTask to its original state
 */
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

/**
 * starts the taskCreated animation and after a timeout of 1.5s it pipes to the board page
 */
function pipeToBoard() {
    document.getElementById('taskAdded').classList.remove('d-none');
    document.getElementById('taskAddedPopup').classList.remove('d-none')
    setTimeout(() => startAnimation('taskAdded', 'task-added-animation'), 125);
    setTimeout(() => window.open('board.html', '_self'), 1500);
}

/**
 * starts the animation
 * 
 * @param {string} id the ID on which the animation starts
 * @param {string} className the name of the animation class
 */
function startAnimation(id, className) {
    let element = document.getElementById(id);
    element.classList.toggle(className);
}

/**
 * gets all elements with the prio-btn class and gives them the new classname if selected
 * 
 * @param {string} btnId the id of the priority btn which is selected
 * @param {string} btnClass the new class the element gets
 */
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

/**
 * resets the currentPriority key of currentTask and pushes the new priority 
 * and the url of the priority img to the array
 * 
 * @param {string} prio the priority of the currentTask
 * @param {string} id the id of the priority img
 */
function addPriorityToTask(prio, id) {
    let imageSource = document.getElementById(id).querySelector('img').src
    currentTask['currentPriority'] = [];
    currentTask['currentPriority'].push(prio);
    currentTask['currentPriority'].push(imageSource);
}

/**
 * adds the category to currentTask and closes the popup
 * 
 * @param {string} id the id of the list item of the category popip
 */
function addCategory(id) {
    let inputField = document.getElementById('categoryInput');
    let listItem = document.getElementById(id);
    inputField.value = listItem.innerText;
    currentTask['category'] = listItem.innerText;
    togglePopup('categoryPopup');
}

/**
 * gives the selected contact the class active-contact if it doesn't have this class
 * then adds it to the displayed contacts. If not is removes the class and it also
 * gets removed from the displayed list
 * 
 * @param {string} id id of selected contact
 * @param {number} index index of the contact in the contacts array 
 */
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

/**
 * adds the contact to the contacts of currentUser
 * 
 * @param {number} index index of contact in the contacts array
 */
function addContactToList(index) {
    currentTask['assignedContacts'].push(currentUser['contacts'][index]);
    renderSelectedContacts('selectedContacts')
}

/**
 * gets the index of the selected contact in the assignedContacts key of currentUser
 * then deletes the contact on that index from the array
 * 
 * @param {index} index index of contact in the contacts array
 */
function removeContactFromList(index) {
    let contact = currentUser['contacts'][index];
    let newIndex = currentTask['assignedContacts'].indexOf(contact);
    currentTask['assignedContacts'].splice(newIndex, 1);
    renderSelectedContacts('selectedContacts');
}

/**
 * renders the selected contacts in the container beneath the inputfield
 * 
 * @param {string} id id of the selected contacts container
 */
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

/**
 * checks if subtasks exist and depending on the outcome it gives the list popup display or hides it
 * then renders the subtasks assigned to currentTask in the subtasklist
 */
function renderSubtasks() {
    let subtaskContainer = document.getElementById('subtasks');
    currentTask['subtasks'].length == 0 ? subtaskContainer.classList.add('d-none') : subtaskContainer.classList.remove('d-none');
    subtaskContainer.innerHTML = '';
    for (let i = 0; i < currentTask['subtasks'].length; i++) {
        const subtask = currentTask['subtasks'][i]['subtaskName'];
        subtaskContainer.innerHTML += generateSubtaskHTML(subtask, i);
    }
}

/**
 * checks if the subtask input has value and if so, pushes the value to the subtasks aray of 
 * currentTask, then resets the value and hides the buttons in the input field
 */
function addSubtask() {
    let subtaskInput = document.getElementById('subtaskInput');
    if (subtaskInput.value != '') {
        currentTask['subtasks'].push({ subtaskName: subtaskInput.value, 'done': false })
        renderSubtasks();
        subtaskInput.value = '';
    };
    toggleSubtaskInput();
}

/**
 * opens the editor to edit the subtasks, while giving the items new classes so they can be edited
 * 
 * @param {number} index the index of the subtask in currentTask
 */
function openSubtaskEditor(index) {
    let input = document.getElementById(`subtask${index}`);
    input.classList.remove('subtask-list-item');
    input.classList.add('subtask-item-edit');
    input.innerHTML = generateSubTaskEditorHTML(index);
}

/**
 * deletes the subtask from the subtasks array
 * 
 * @param {number} index index of the subtask in currentTask
 */
function deleteSubtask(index) {
    currentTask['subtasks'].splice(index, 1);
    renderSubtasks();
}

/**
 * changes the key of the subtask in the currentTask array with the new value from the input
 * 
 * @param {number} index index of the subtask in currentTask
 */
function editSubtask(index) {
    let edit = document.getElementById(`subtaskInput${index}`);
    currentTask['subtasks'][index]['subtaskName'] = edit.value;
    renderSubtasks();
}

/**
 * toggles the display of the subtask input
 */
function toggleSubtaskInput() {
    togglePopup('addSubtaskIcon');
    togglePopup('editSubtaskIcons');
}

/**
 * toggles the elements display from none to its default
 * 
 * @param {string} id id of the element which should get display none
 */
function togglePopup(id) {
    document.getElementById(id).classList.toggle('d-none');
}

/**
 * resets the value of the editor input and hide the icons to edit and add the subtask
 * 
 * @param {string} id the id of the input to edit the subtasks
 */
function clearInput(id) {
    document.getElementById(id).value = '';
    togglePopup('addSubtaskIcon');
    togglePopup('editSubtaskIcons');
}

/**
 * one function to close all possibly opened popups in the form
 */
function closeAllPopupsInAddTask() {
    document.getElementById('contactsPopup').classList.add('d-none');
    document.getElementById('categoryPopup').classList.add('d-none');
    document.getElementById('editSubtaskIcons').classList.add('d-none');
    document.getElementById('addSubtaskIcon').classList.remove('d-none');
}

/**
 * if the pressed key is enter it executes the function of the element
 * 
 * @param {event} event onkeypress
 * @param {string} id the id of the button which function shall be executed
 */
function callOnEnterPress(event, id) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById(id).click();
    }
}

/**
 * generates the the html of each contact for the contacts list
 * 
 * @param {object} contact one of the contact objects from the contacts array
 * @param {number} i the index of the the contact
 * @returns 
 */
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

/**
 * generates the html code for the subtask editor
 * 
 * @param {number} index index of the subtask in the subtasks array
 * @returns 
 */
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

/**
 * generates the subtask list beneath the subtask input
 * 
 * @param {string} subtask the text of the subtask
 * @param {number} index the index of the subtask in the array
 * @returns 
 */
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

