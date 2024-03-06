
let currentDraggedElement = {};
/**
 * loads the html template for the addTask popup 
 * then loads the contacts and the tasks from the remote storage
 */
async function init() {
  await includeHTML();
  await load();
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
 * renders all columns
 */
function renderAllTasks(array) {
  renderTaskColumn('toDo', array)
  renderTaskColumn('inProgress', array)
  renderTaskColumn('awaitFeedback', array);
  renderTaskColumn('done', array);
}

/**
 * Toggles the addTaskPopup and starts the slide in animation
 */
async function openAddTaskPopup(column) {
  await includeHTML();
  renderContacts();
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
  await setItem('currentUser', JSON.stringify(currentUser));
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

function renderFullContacts(id) {
  let container = document.getElementById(id);
  container.innerHTML = '';
  for (let i = 0; i < currentTask['assignedContacts'].length; i++) {
    const contact = currentTask['assignedContacts'][i];
    container.innerHTML += generatePopupContactsHTML(contact);
  }
}

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

function updateProgressBar(index, doneSubtasks) {
  let progressbar = document.getElementById(`progressBar${index}`);
  let task = currentUser['tasks'][index];
  let width = (doneSubtasks.length / task['subtasks'].length) * 100;
  progressbar.style.width = `${width}%`;
  if (width == 100) {
    progressbar.style.backgroundColor = '#7AE229'
  }
}

async function updateTasks(index) {
  currentUser['tasks'].splice(index, 1, currentTask);
  await setItem('currentUser', JSON.stringify(currentUser));
  renderAllTasks(currentUser['tasks']);
}

function deleteTask(index) {
  currentUser['tasks'].splice(index, 1);
  closeTaskPopup();
  renderAllTasks(currentUser['tasks']);
}

function openTaskEditor(index) {
  let popupContainer = document.getElementById('popupContent');
  document.getElementById('addTaskForm').innerHTML = '';
  popupContainer.innerHTML = generateTaskEditorHTML(currentTask, index);
  renderTaskData();
}

function renderTaskData() {
  renderContacts();
  highlightSelectedContacts();
  renderSelectedContacts('selectedContacts');
  renderSubtasks();
  getPriority();
}

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

function highlightSelectedContacts() {
  const contactList = document.getElementById('contactList');
  const allContacts = contactList.querySelectorAll('li');
  allContacts.forEach(contact => {
    contact.classList.remove('active-contact');
    const index = Array.from(contactList.children).indexOf(contact);
    const assigned = currentTask['assignedContacts'].find(assignedContact => JSON.stringify(assignedContact) === JSON.stringify(contacts[index]));
    if (assigned) {
      contact.classList.add('active-contact');
      contact.querySelector('input').checked = true;
    }
  });
}

function editTask(index) {
  getTaskData();
  currentUser['tasks'].splice(index, 1, currentTask);
  resetCurrentTask();
  closeTaskPopup();
  renderAllTasks(currentUser['tasks']);
}

function closePopupInTaskEditor(id) {
  document.getElementById(id).classList.add('d-none');
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * closes the addTaskPopup 
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

function filterTasks() {
  let searchValue = document.getElementById('searchInput').value.toLowerCase();
  let matchingTasks = [];
  currentUser['tasks'].forEach(task => {
    let match = task['title'].toLowerCase().includes(searchValue);
    if (match) {
      matchingTasks.push(task);
    } 
  });
  renderAllTasks(matchingTasks);
}

/* Drag and drop funktionen*/
function startDragging(index) {
  let task = currentUser['tasks'][index];
  currentDraggedElement = task;
  console.log(currentDraggedElement);
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveToContainer(category) {
  currentDraggedElement['currentColumn'] = category;
  await setItem('tasks', JSON.stringify(tasks));
  renderAllTasks(tasks);
}

function highlightDropZone(id) {
  document.getElementById(id).classList.add('drop-zone');
}

function toggleCardRotation(id) {
  document.getElementById(id).classList.toggle('rotate')
}

function zoomOnDrag(id) {
  document.getElementById(id).classList.toggle('drop-zone-expanded');
}

function removeHighlightDropZone(id) {
  document.getElementById(id).classList.remove('drop-zone');
}

function showMoveToPopup(id) {
  document.getElementById(id).classList.remove('d-none');
}

async function moveToColumn(index, column) {
  let task = currentUser['tasks'][index];
  task['currentColumn'] = column;
  // await setItem('tasks', JSON.stringify(tasks));
  renderAllTasks(currentUser['tasks']);
}

