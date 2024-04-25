
let currentDraggedElement = {};
/**
 * loads the html template for the addTask popup 
 * then resets the currentUser and loads the data, then checks if the currentUser is loggedin,
 * then renders contacts and all tasks
 */
async function init() {
  await includeHTML();
  resetCurrentUser();
  await load();
  checkIfLoggedIn();
  renderContacts();
  renderAllTasks(currentUser['tasks']);
}

/**
 * Renders depending on the column the tasks with the right 'column' key in one of 
 * the board columns. Only if the column matches the tasks column property a new task 
 * is created
 * 
 * @param {string} column name of the column, can be 'toDo', 'inProgress', 'awaitFeedback', 'done'
 */
function renderTaskColumn(column, array) {
  let tasksContainer = document.getElementById(`tasks-${column}`);
  tasksContainer.innerHTML = '';
  for (let i = 0; i < array.length; i++) {
    currentTask = array[i];
    if (currentTask['currentColumn'] == column) {
      tasksContainer.innerHTML += generateTasksHTML(currentTask, i);
      renderSelectedContacts(`assignedTo${i}`);
      renderExtraContacts(`extraContactsPopup${i}`);
      showSubtaskStatus(i)
    }
  }
  checkIfTasksExist(column);
  resetCurrentTask();
}

/**
 * Checks if the column in which the tasks are rendered is empty or not
 * Depending on the outcome it toggles the display of the 'no tasks to do' container
 * 
 * @param {string} column name of the column, can be 'toDo', 'inProgress', 'awaitFeedback', 'done'
 */
function checkIfTasksExist(column) {
  let taskContainer = document.getElementById(`tasks-${column}`);
  if (taskContainer.innerHTML != '') {
    document.getElementById(column).classList.add('d-none')
  } else {
    document.getElementById(column).classList.remove('d-none');
  }
}

/**
 * renders all tasks in the right column
 * 
 * @param {array} array the the array which shall be used for rendering
 */
function renderAllTasks(array) {
  renderTaskColumn('toDo', array)
  renderTaskColumn('inProgress', array)
  renderTaskColumn('awaitFeedback', array);
  renderTaskColumn('done', array);
}

/**
 * loads the addTask template, put the initials on the profile button,
 * then renders the contacts needed for the add Task Popup,
 * starts the slide in animation for the popup
 * 
 * @param {string} column sets the property of currentColumn of the new Task 
 */
async function openAddTaskPopup(column) {
  await includeHTML();
  setInitials();
  renderContacts();
  renderTodaysDate();
  document.getElementById('popup').classList.toggle('d-none');
  setTimeout(() => startAnimation('addTaskPopup', 'popup-show'), 125);
  currentTask['currentColumn'] = column;
}

/**
 * creates a new Task and saves it in the currentTask variable
 * then sends the tasks array to the remote storage
 * in the end resets the popup
 */
async function newTask() {
  getTaskData();
  currentUser['tasks'].push(currentTask);
  saveCurrentUser();
  disableButton();
  await updateUsers();
  renderAllTasks(currentUser['tasks']);
  resetPopup();
}

/**
 * resets the form starts the slide animation and closes after a delay the popup
 */
function resetPopup() {
  resetAddTask()
  document.getElementById('taskAdded').classList.add('flex');
  startAnimation('taskAdded', 'task-added-animation')
  setTimeout(() => {
    slideOutPopup();
    startAnimation('taskAdded', 'task-added-animation');
  }, 1500);
}

/**
 * opens the popup in which you get a detailed view of the task
 * After the popup is rendered the slide animation starts
 * 
 * @param {number} index the index of the current task 
 */
function openTaskPopup(index) {
  renderTaskPopup(index);
  renderFullContacts('assignedContactsInPopup');
  togglePopup('secondPopup')
  setTimeout(() => {
    startAnimation('popupContent', 'popup-show')
  }, 125);
  checkIfDone();
}

/**
 * Depending on the current task it generates the content of the task popup
 * 
 * @param {number} index the index of the current task 
 */
function renderTaskPopup(index) {
  currentTask = currentUser['tasks'][index];
  let popupContent = document.getElementById('popupContent');
  popupContent.innerHTML = generateTaskPopupHTML(currentTask, index);
  renderSelectedContacts('assignedContactsInPopup');
}

/**
 * renders the contacts (name and initials) to the desired container
 * 
 * @param {string} id the id of the container in which the contacts should be rendered
 */
function renderFullContacts(id) {
  let container = document.getElementById(id);
  container.innerHTML = '';
  for (let i = 0; i < currentTask['assignedContacts'].length; i++) {
    const contact = currentTask['assignedContacts'][i];
    container.innerHTML += generatePopupContactsHTML(contact);
  }
}

/**
 * checks if subtask is done and depending on the outcome checks the checkbox and crosses
 * the subtasks value by changing its class to line-through
 */
function checkIfDone() {
  for (let i = 0; i < currentTask['subtasks'].length; i++) {
    const subtask = currentTask['subtasks'][i];
    if (subtask['done']) {
      document.getElementById(`subtaskList${i}`).checked = true;
      document.getElementById(`subtaskLabel${i}`).classList.add('line-through');
    } else {
      document.getElementById(`subtaskLabel${i}`).classList.remove('line-through');
    }
  }
}

/**
 * Checks depending on the current task how many subtasks exist and creates
 * html code to display it in the task popup
 * 
 * @param {number} index the index of the current task 
 * @returns the html code
 */
function getSubtasks(index) {
  let html = '';
  let task = currentUser['tasks'][index];
  for (let i = 0; i < task['subtasks'].length; i++) {
    const subtask = task['subtasks'][i];
    html += generataeSubtaskPopupHTML(subtask, i)
  }
  return html;
}

/**
 * changes the property of the subtasks from done to false and the other way around
 * 
 * @param {number} index index of the subtask in the subtask array of currentTask
 */
function markSubtaskAsDone(index) {
  subtasks = currentTask['subtasks'];
  if (!subtasks[index]['done']) {
    subtasks[index]['done'] = true;
    document.getElementById(`subtaskLabel${index}`).classList.add('line-through');
  } else {
    subtasks[index]['done'] = false;
    document.getElementById(`subtaskLabel${index}`).classList.remove('line-through');
  }
}

/**
 * checks if subtasks exist and if so displays the progressbar
 * each subtask with done set to true gets pushed to the done array
 * then updates the progressbar and gives out the amount of all subtasks and also of the done ones
 * 
 * @param {number} index index of the task of tasks array of currentUser
 */
function showSubtaskStatus(index) {
  let task = currentUser['tasks'][index];
  if (task['subtasks'].length != 0) {
    document.getElementById(`progress${index}`).classList.remove('d-none');
    let done = [];
    task['subtasks'].forEach(subtask => {
      if (subtask['done']) {
        done.push(subtask);
      }
    });
    updateProgressBar(index, done);
    document.getElementById(`doneSubtasks${index}`).innerHTML = done.length;
    document.getElementById(`subtaskAmount${index}`).innerHTML = task['subtasks'].length;
  } else {
    document.getElementById(`progress${index}`).classList.add('d-none');
  }

}

/**
 * calculates how much percent of subtasks are done and sets the result as width of the progressbar
 * if all subtasks are done it changes the color of the bar to green
 * 
 * @param {number} index index of the task of tasks array of currentUser
 * @param {array} doneSubtasks array with done subtasks
 */
function updateProgressBar(index, doneSubtasks) {
  let progressbar = document.getElementById(`progressBar${index}`);
  let task = currentUser['tasks'][index];
  let width = (doneSubtasks.length / task['subtasks'].length) * 100;
  progressbar.style.width = `${width}%`;
  if (width == 100) {
    progressbar.style.backgroundColor = '#7AE229'
  }
}

/**
 * exchanges the edited subtask in the subtasks array
 * 
 * @param {number} index index of the task of tasks array of currentUser
 */
async function updateTasks(index) {
  currentUser['tasks'].splice(index, 1, currentTask);
  await updateUsers();
  renderAllTasks(currentUser['tasks']);
}

/**
 * deletes the task from the tasks array and saves the new currentUser Object on the server
 * then renders all tasks
 * 
 * @param {number} index index of the task of tasks array of currentUser
 */
async function deleteTask(index) {
  currentUser['tasks'].splice(index, 1);
  saveCurrentUser();
  closeTaskPopup();
  await updateUsers();
  renderAllTasks(currentUser['tasks']);
}

/**
 * opens the task editor in the popup and renders the task data 
 * 
 * @param {number} index index of the task of tasks array of currentUser
 */
function openTaskEditor(index) {
  let popupContainer = document.getElementById('popupContent');
  document.getElementById('addTaskForm').innerHTML = '';
  popupContainer.innerHTML = generateTaskEditorHTML(currentTask, index);
  renderTaskData();
}

/**
 * renders the contacts, highlights the selected contacts, also renders them, renders the subtasks and gets the tasks 
 * priority
 */
function renderTaskData() {
  renderContacts();
  highlightSelectedContacts();
  renderSelectedContacts('selectedContacts');
  renderSubtasks();
  getPriority();
}

/**
 * saves all elements with the class prio-btns to the node list prioBtns, then gets the priority of the currentTask
 * then removes all active classes from the buttons and gives only the button with the matching priority the active class
 */
function getPriority() {
  let prioBtns = document.querySelectorAll('.prio-btn');
  let priority = currentTask['currentPriority'][0];
  prioBtns.forEach(btn => {
    btn.classList.remove('urgent-btn', 'medium-btn', 'low-btn')
    let text = btn.innerText.replace(' ', '').toLowerCase();
    if (text == priority) {
      btn.classList.add(`${text}-btn`);
    }
  });
};

/**
 * gets all li items within the contactList, then removes from all contacts the active class
 * then makes the nodeList into an array object, so the indexOf method works, then gets the index 
 * of the index of this contact in the new array
 * then stringifies the contact and also the assigend contact and checks if they are the same
 * if so, the li item gets the active class and the checkbox gets checked
 * 
 */
function highlightSelectedContacts() {
  let contactList = document.getElementById('contactList');
  let allContacts = contactList.querySelectorAll('li');
  allContacts.forEach(contact => {
    contact.classList.remove('active-contact');
    let index = Array.from(contactList.children).indexOf(contact);
    let assigned = currentTask['assignedContacts'].find(assignedContact => JSON.stringify(assignedContact) === JSON.stringify(currentUser['contacts'][index]));
    if (assigned) {
      contact.classList.add('active-contact');
      contact.querySelector('input').checked = true;
    }
  });
}

/**
 * gets the data from all the inputs and exchanges the task in the currentUser task array
 * then resets the editor, closes the popup and renders all tasks
 * 
 * @param {number} index index of the task of tasks array of currentUser
 */
async function editTask(index) {
  getTaskData();
  currentUser['tasks'].splice(index, 1, currentTask);
  saveCurrentUser();
  await updateUsers();
  resetCurrentTask();
  closeTaskPopup();
  renderAllTasks(currentUser['tasks']);
}

/**
 * closes the popup
 * 
 * @param {string} id id of the task editor popup
 */
function closePopupInTaskEditor(id) {
  document.getElementById(id).classList.add('d-none');
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * closes the addTaskPopup  and starts the slide animation
 */
function slideOutPopup() {
  setTimeout(() => document.getElementById('popup').classList.toggle('d-none'), 125);
  startAnimation('addTaskPopup', 'popup-show')
}

/**
 * starts the slide in animation from the right side to the left side
 * 
 * @param {string} id id of the DOM element on which the animation should start
 * @param {string} className the name of the class, which contains the animation
 */
function startAnimation(id, className) {
  let element = document.getElementById(id);
  element.classList.toggle(className);
}

/**
 * closes the popup for the detailed vied of the task and after a short delay it
 * starts the slide animation to hide the popup container
 */
function closeTaskPopup() {
  setTimeout(() => document.getElementById('secondPopup').classList.toggle('d-none'), 125);
  startAnimation('popupContent', 'popup-show')
}

/**
 * gets the value of the search input and puts it to lowercase, then checks if the value 
 * matches the title of the tasks of currentUser and if so pushes the task to the matchingTasks array
 * then renders all tasks new
 */
function filterTasks() {
  let searchValue = document.getElementById('searchInput').value.toLowerCase();
  let matchingTasks = [];
  currentUser['tasks'].forEach(task => {
    let matchTitle = task['title'].toLowerCase().includes(searchValue);
    let matchPriority = task['currentPriority'][0].toLowerCase().includes(searchValue);
    let matchDescription = task['description'].toLowerCase().includes(searchValue);
    if (matchTitle || matchPriority || matchDescription) {
      matchingTasks.push(task);
    }
  });
  renderAllTasks(matchingTasks);
}

/**
 * sets the currentTask as currentDraggedElement
 * 
 * @param {number} index index of the task of tasks array of currentUser
 */
function startDragging(index) {
  let task = currentUser['tasks'][index];
  currentDraggedElement = task;
 
}

/**
 * allows to drop elements in the container
 * 
  * @param {event} ev drop event
 */
function allowDrop(ev) {
  ev.preventDefault();
  ev.stopPropagation(); 
}
/**
 * changes the column to the desired column and saves the new tasks in currentUser and on the server
 * 
 * @param {string} column the name of the column in which it shall be rendered
 */
async function moveToContainer(column) {
  currentDraggedElement['currentColumn'] = column;
  saveCurrentUser();
  await updateUsers();
  renderAllTasks(currentUser['tasks']);
}

/**
 * gives the element the class drop zone and highlights the zone
 * 
 * @param {string} id id of the dropzone
 */
function highlightDropZone(id) {
  document.getElementById(id).classList.add('drop-zone');
}

/**
 * removes the drop zone class from the element
 * 
 * @param {string} id id of the dropzone
 */
function removeHighlightDropZone(id) {
  document.getElementById(id).classList.remove('drop-zone');
}

/**
 * removes the display none property of the move to popup
 * 
 * @param {string} id ID of the Move to Element
 */
function showMoveToPopup(id) {
  document.getElementById(id).classList.remove('d-none');
}

/**
 * changes the column of the selected task to the desired one, then saves the new value to the server and 
 * renders all tasks
 * 
 * @param {number} index index of the task of the tasks array in currentUser
 * @param {string} column 
 */
async function moveToColumn(index, column) {
  let task = currentUser['tasks'][index];
  task['currentColumn'] = column;
  saveCurrentUser();
  updateUsers();
  renderAllTasks(currentUser['tasks']);
}

