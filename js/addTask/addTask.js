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
 * resets the currentUser
 * loads the header and sidebar, then loads the currentUser and Users from the server
 * then checks if it is logged in, then renders the contacts in the contactList
 */
async function initAddTask() {
    resetCurrentUser();
    await includeHTML();
    await load();
    checkIfLoggedIn();
    renderContacts();
    renderTodaysDate();
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
    saveCurrentUser();
    await updateUsers();
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
    resetAssignedContacts();
    resetSubtasks();
    resetPriority();
}

function resetAssignedContacts() {
    renderSelectedContacts('selectedContacts');
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    renderContacts();
    closePopup('contactsPopup');
}

function resetSubtasks() {
    document.getElementById('subtasks').innerHTML = '';
    closePopup('subtasks');
}

function resetPriority() {
    let allBtns = document.querySelectorAll('.prio-btn');
    allBtns.forEach(btn => btn.classList.remove('urgent-btn', 'medium-btn', 'low-btn'));
    document.getElementById('mediumBtn').classList.add('medium-btn');
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
    let contact = JSON.stringify(currentUser['contacts'][index]);
    if (currentTask['assignedContacts']) {
        for (let i = 0; i < currentTask['assignedContacts'].length; i++) {
            const assignedContact = currentTask['assignedContacts'][i];
            let assignedContactAsString = JSON.stringify(assignedContact);
            if (assignedContactAsString == contact) {
                currentTask['assignedContacts'].splice(i, 1);
            }
        }
    }
    
    renderSelectedContacts('selectedContacts');
}

/**
 * renders the selected contacts in the container beneath the inputfield
 * if the number of contacts is greater than 4 it renders an extra icon for the additional contacts
 * 
 * 
 * @param {string} id id of the selected contacts container
 */
function renderSelectedContacts(id) {
    let selecetedContactsContainer = document.getElementById(id);
    selecetedContactsContainer.innerHTML = '';
    if (currentTask['assignedContacts']) {
        for (let i = 0; i < currentTask['assignedContacts'].length; i++) {
            const contact = currentTask['assignedContacts'][i];
            if (i < 4) {
                selecetedContactsContainer.innerHTML += /*html*/`<div class="initials ${contact['color']}">${contact['initials']}</div>`;
            }
            let moreThanFourContacts = i >= 4 && i == currentTask['assignedContacts'].length - 1;
            if (moreThanFourContacts) {
                let extraContacts = currentTask['assignedContacts'].length - 4;
                let index = getIndexOfTask();
                selecetedContactsContainer.innerHTML += generateExtraContactPopupHTML(extraContacts, index);
            }
        }
    }

}

/**
 * 
 * @returns the index of currentTask in the currentUsers tasks array and 
 */
function getIndexOfTask() {
    let index = currentUser['tasks'].indexOf(currentTask);
    return index;
}

/**
 * renders the html code for the additional contacts
 * 
 * @returns the html code
 */
function renderExtraContacts() {
    let html = '';
    if (currentTask['assignedContacts']) {
        for (let i = 4; i < currentTask['assignedContacts'].length; i++) {
            const contact = currentTask['assignedContacts'][i];
            html += /*html*/`
                <div class="initials ${contact['color']}">${contact['initials']}</div>
            `
        }
        return html;
    }
}

/**
 * checks if subtasks exist and depending on the outcome it gives the list popup display or hides it
 * then renders the subtasks assigned to currentTask in the subtasklist
 */
function renderSubtasks() {
    let subtaskContainer = document.getElementById('subtasks');
    if (currentTask['subtasks']) {
        currentTask['subtasks'].length == 0 ? subtaskContainer.classList.add('d-none') : subtaskContainer.classList.remove('d-none');
        subtaskContainer.innerHTML = '';
        for (let i = 0; i < currentTask['subtasks'].length; i++) {
            const subtask = currentTask['subtasks'][i]['subtaskName'];
            subtaskContainer.innerHTML += generateSubtaskHTML(subtask, i);
        }
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
 * checks todays date and puts this date as minimum attribut in the due date input field
 */
function renderTodaysDate() {
    let date = getCurrentDate();
    let dateInput = document.getElementById('dateInput');
    dateInput.setAttribute('min', date);
    dateInput.setAttribute('max', '2100-12-31');
}

