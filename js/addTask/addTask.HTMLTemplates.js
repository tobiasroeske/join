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

/**
 * generates the html code for the extra contacts popup
 * 
 * @param {number} contacts if there are more contacts than 4, the extra number gets displayed
 * @param {number} index the index of the currentTask in the currentUser tasks array
 * @returns 
 */
function generateExtraContactPopupHTML(contacts, index) {
    return /*html*/`
    <div class="initials black hover-active" onmouseover="togglePopup('extraContactsPopup${index}'); stopCurrentAction(event)" onmouseout="togglePopup('extraContactsPopup${index}'); stopCurrentAction(event)">
        +${contacts}
        <div class="extra-contacts-popup-addTask d-none" id="extraContactsPopup${index}">
            ${renderExtraContacts()}
        </div>
    </div>
`
}