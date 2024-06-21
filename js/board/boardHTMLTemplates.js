function generateTasksHTML(task, index) {
  return /*html*/`
      <div class="task-design" id="card-${index}" draggable="true" ondragstart="startDragging(${index})" ontouchstart="touchStart(${index})" ontouchend="touchEnd()">
          <div class="move-to-popup d-none" id="moveToPopup${index}">
            <div class="move-to-top">
              <span>Move to: </span>
              <img src="assets/img/board_close_mobile.svg" alt="" onclick="closePopupInTaskEditor('moveToPopup${index}')">
            </div>
            <ul class="styled-list">
              <li onclick="moveToColumn(${index}, 'toDo')">Todo</li>
              <li onclick="moveToColumn(${index}, 'inProgress')">In Progress</li>
              <li onclick="moveToColumn(${index}, 'awaitFeedback')">Await Feedback</li>
              <li onclick="moveToColumn(${index}, 'done')">Done</li>
            </ul>
          </div>
          <div onclick="openTaskPopup(${index})">
              <div id="taskUserStory" class="task-${task['category'].replace(' ', '')}">${task['category']}</div>
              <div id="taskTitle" class="task-title">${task['title']}</div>
              <div id="taskDescription" class="task-description">${task['description']}</div>
              <div class="progress-container d-none" id="progress${index}">
                <div class="custom-progress">
                  <div class="custom-progress-bar" id="progressBar${index}">

                  </div>
                </div>
                <div>
                  <span id="doneSubtasks${index}"></span>/<span id="subtaskAmount${index}"></span> Subtasks
                </div>
              </div>
              <div class="assigned-and-prio">
                  <div id="assignedTo${index}" class="assigned-to"> </div>
                  <div id="taskPriority" class="task-priority">
                      <img src="${task['currentPriority'][1]}" alt="">
                  </div>
              </div>
          </div>
      </div>
  `;
}

function generateTaskEditorHTML(task, index) {
    return /*html*/`
    <div class="edit-container">
      <div class="flex-end">
        <img src="assets/img/contacts_close.svg" alt="" class="icon" onclick="closeTaskPopup()">
      </div>
      <form onsubmit="editTask(${index}); return false;"> 
        <div class="input-container">
          <label for="titleInput">Title</label>
          <input value="${task['title']}" type="text" name="title" id="titleInput" class="input" required placeholder="Enter a title">
        </div>
        <div class="input-container">
          <label for="descriptionTextarea">Description</label>
          <textarea name="description" id="descriptionTextarea" cols="30" rows="10"
          placeholder="Enter a Description" class="textarea">${task['description']}</textarea>
        </div>
        <div class="input-container">
          <label for="dateInput">Due date </label>
          <input value="${task['dueDate']}"type="date" name="dueDate" id="dateInput" placeholder="dd/mm/yyyy"
              class="input date-input" required>
        </div>
        <div class="prio-buttons">
          <div class="prio-btn" id="urgentBtn" onclick="selectPriority('urgentBtn', 'urgent-btn'); addPriorityToTask('urgent', 'urgentBtn')">Urgent
            <img src="assets/img/prio_high_icon.svg" alt="high priority icon" class="prio-icon">
          </div>
          <div class="prio-btn medium-btn" id="mediumBtn"
                onclick="selectPriority('mediumBtn', 'medium-btn'); addPriorityToTask('medium', 'mediumBtn')">Medium
            <img src="assets/img/addTask_medium_orange.svg" alt="medium priority icon" class="medium-icon"
                    class="prio-icon">
          </div>
          <div class="prio-btn" id="lowBtn" onclick="selectPriority('lowBtn', 'low-btn'); addPriorityToTask('low', 'lowBtn')">Low 
            <img src="assets/img/prio_low_icon.svg" alt="low priority icon" class="prio-icon"></div>
          </div>
          <div class="input-container" onclick="togglePopup('contactsPopup'); stopCurrentAction(event)">
            <label for="assignedContacts">Assigned to</label>
            <div class="input-field category-input">
              <input type="text" id="assignedContacts" placeholder="Select Contacts to assign"
                  class="special-input">
              <img src="assets/img/drop_down_array_icon.svg" alt="" class="icon input-icon">
            </div>
            <div class="category-popup d-none" id="contactsPopup">
              <ul class="styled-list" id="contactList">
              
              </ul>
            </div>
              <div class="flex gap-8" id="selectedContacts">
                                     
            </div>
          </div>
          <div class="input-container" id="subtaskInputField">
            <label for="subtaskInput">Subtasks</label>
            <div class="input-field" onclick="toggleSubtaskInput(); stopCurrentAction(event)" >
              <input type="text" class="special-input subtask-input" name="subtasks"
                  id="subtaskInput" placeholder="Add new subtask" onkeypress="callOnEnterPress(event, 'addSubtaskBtn')">
              <img src="assets/img/addTask_add.svg" alt="" class="icon special-input-icon" id="addSubtaskIcon">
              <div class="input-icon-box d-none" id="editSubtaskIcons">
                <img src="assets/img/addTask_close.svg" alt=""class="edit-icon" onclick="clearInput('subtaskInput'); stopCurrentAction(event)">
                <img src="assets/img/addTask_check.svg" alt=""class="edit-icon" onclick="addSubtask(); stopCurrentAction(event)" id="addSubtaskBtn">
              </div>
            </div>
          </div>
          <div>
            <ul id="subtasks" class="subtasks d-none">
              
            </ul>
          </div>
          <div class="flex-end">
            <button class="submit-btn add-btn hover-active">Ok <img src="assets/img/check_icon.svg" alt=""></button>
          </div>
      </form>
    </div>
    `
}

function generateTaskPopupHTML(task, index) {
    return /*html*/`
    <div class="popup-category">
      <div class="task-${task['category'].replace(' ', '')}">${task['category']}</span>  </div>
      <div><img src="assets/img/contacts_close.svg" alt="" class="icon" onclick="closeTaskPopup(); updateTasks(${index})"></div>
    </div>
    <div class="flex-1">
      <h1 class="page-heading3">${task['title']}</h1>
      <div class="description-popup"><span>${task['description']}</span></div>
      <div class="popup-date">
        <span>Due Date: </span>
        <div class="popup-date2">   <span>${task['dueDate']}</span> </div>
      </div>
      <div class="priority-popup">
        <span>Priority: </span>
        <div class="priority-popup2"> <span>${capitalizeFirstLetter(task['currentPriority'][0])} <img src="${task['currentPriority'][1]}" alt=""></span> </div>
      </div>
      <div class="popup-assignedto">
        Assigned To:
      <div class="popup-assignedto2" id="assignedContactsInPopup"></div>
      </div>
      <div class="popup-subtasks">
        Subtasks:
      <div class="popup-subtasks2" id="subtask${index}">${getSubtasks(index)}</div>
      </div>
    </div>
    <div class="edit-and-delete">   
      <div class="popup-delete" onclick="deleteTask(${index})">
        <img src="assets/img/delete.png" alt="" class="deleteicon">Delete
      </div>
      <div class="popup-edit" onclick="openTaskEditor(${index})">
        <img src="assets/img/edit.png" alt="" class="editicon">Edit
      </div>
    </div>
  `;
}

function generatePopupContactsHTML(contact) {
    return /*html*/`
    <div class="contacts-in-popup">
      <div class="initials ${contact['color']}">${contact['initials']}</div>
      <div>${contact['name']}</div>
    </div>
    `;
}

function generataeSubtaskPopupHTML(subtask, index) {
    return /*html*/`
    <div class="subtask-box">
      <input type="checkbox" id="subtaskList${index}" onclick="markSubtaskAsDone(${index})">
      <label for="subtaskList${index}" id="subtaskLabel${index}">${subtask['subtaskName']}</label>
    </div>
  `;
}


