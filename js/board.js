
/**
 * loads the html template for the addTask popup 
 * then loads the contacts and the tasks from the remote storage
 */
async function init() {
  await includeHTML();
  await initAddTask();
  // await loadTasks();
  renderAllTasks();
}

/**
 * Renders depending on the column the tasks with the right 'column' key in one of 
 * the board columns. Only if the column matches the tasks column property a new task 
 * is created
 * 
 * @param {string} column name of the column, can be 'toDo', 'inProgress', 'awaitFeedback', 'done'
 */
function renderTaskColumn(column) {
  let tasksContainer = document.getElementById(`tasks-${column}`);
  tasksContainer.innerHTML = '';
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task['column'] == column) {
      tasksContainer.innerHTML += generateTasksHTML(task, i);
    }
  }
  checkIfTasksExist(column);
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
function renderAllTasks() {
  renderTaskColumn('toDo')
  renderTaskColumn('inProgress')
  renderTaskColumn('awaitFeedback');
}

/**
 * Generates the html code for the task containers
 * Each task container gets its unique id, depending on the index
 * 
 * @param {object} task one task from the tasks array
 * @param {number} index the index of the current task 
 * @returns 
 */
function generateTasksHTML(task, index) {
  return /*html*/`
  <div class="task-design" id="card-${index}" draggable="true">
    <div id="drop-zone">
      <div onclick="openTaskPopup(${index})">
        <div id="taskUserStory" class="task-${task['category'].replace(' ', '')}">${task['category']}</div>
        <div id="taskTitle" class="task-title">${task['title']}</div>
        <div id="taskDescription" class="task-description">${task['description']}</div>
        <div id="dueDate" class="due-date">${task['dueDate']}</div>
        <div id="taskPriority" class="task-priority">${task['priority']}</div>
        <div id="assignedTo" class="assigned-to">${task['assignedContact']}</div>
        <div class="w3-light-grey w3-round-xlarge progressbar">
            <div class="w3-container w3-blue w3-round-xlarge progressbar" style="width:50%"
                id="taskProgress"></div>
        </div>
        <div id="taskSubtasks" class="Subtasks"></div>
        <div id="taskWorker" class="task-worker"></div>
    </div>
</div>
`;
}

/**
 * opens the popup in which you get a detailed view of the task
 * After the popup is rendered the slide animation starts
 * 
 * @param {number} index the index of the current task 
 */
function openTaskPopup(index) {
  renderTaskPopup(index);
  togglePopup('secondPopup') 
  setTimeout(() => startAnimation('popupContent', 'popup-show'),125);
}

/**
 * Depending on the current task it generates the content of the task popup
 * 
 * @param {number} index the index of the current task 
 */
function renderTaskPopup(index) {
  let popupContent = document.getElementById('popupContent');
  let task = tasks[index];
  popupContent.innerHTML = generateTaskPopupHTML(task, index);
}

/**
 * generates the html code for the tasks popup
 * taking the current task object and its index in the array as parameters
 * 
 * @param {object} task one task from the tasks array
 * @param {number} index the index of the current task 
 * @returns 
 */
function generateTaskPopupHTML(task, index) {
  return /*html*/`
  <div>
    <span class="task-${task['category'].replace(' ', '')}">${task['category']}</span>
    <img src="assets/img/contacts_close.svg" alt="" class="icon" onclick="closeSecondPopup()">
  </div>
  <h1 class="page-heading">${task['title']}</h1>
  <span>${task['description']}</span>
  <div>
    <span>Due Date: </span>
    <span>${task['dueDate']}</span>
  </div>
  <div>
    <span>Priority: </span>
    <span>${task['priority']}</span>
  </div>
  <div>
    Assigned To:
    <ul>
      <li>${task['assignedContact']}</li>
    </ul>
  </div>
  <div>
    Subtasks:
    ${renderSubtasksForPopup(index)}
  </div>

`;
}

/**
 * Checks depending on the current task how many subtasks exist and creates
 * html code to display it in the task popup
 * 
 * @param {number} index the index of the current task 
 * @returns the html code
 */
function renderSubtasksForPopup(index) {
  let html = '';
  let task = tasks[index];
  for (let i = 0; i < task['subtasks'].length; i++) {
    const subtask = task['subtasks'][i];
    html += /*html*/`
    <div>
      <input type="checkbox" id="subtask${i}">
      <label for="subtask${i}">${subtask}</label>
    </div>
  `;
  }
  return html;
} 

/**
 * creates a new Task and saves it in the currentTask variable
 * then sends the tasks array to the remote storage
 * in the end resets the popup
 */
async function newTask() {
  getTaskData();
  tasks.push(currentTask);
  await setItem('tasks', JSON.stringify(tasks));
  renderAllTasks();
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
    closePopup();
    startAnimation('taskAdded', 'task-added-animation');
  }, 1500);
}

/**
 * Toggles the addTaskPopup and starts the slide in animation
 */
async function openAddTaskPopup(column) {
  await includeHTML();
  renderContacts();
  document.getElementById('popup').classList.toggle('d-none');
  setTimeout(() => startAnimation('addTaskPopup', 'popup-show'), 125);
  currentColumn = column;
}

/**
 * closes the addTaskPopup 
 */
function closePopup() {
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
function closeSecondPopup() {
  setTimeout(() => document.getElementById('secondPopup').classList.toggle('d-none'), 125);
  startAnimation('popupContent', 'popup-show')
}

// I commented this function out, because I wrote a new one

// function openSecondPopup() {
//   let popup = document.getElementById('secondPopup');
//   let taskDesignContent = document.querySelector('.task-design').innerHTML;
//   let popupContent = popup.querySelector('.popup2-content');
//   let taskTitle = popupContent.querySelector('.task-title');

//   if (taskTitle) {
//     taskTitle.style.fontSize = '50px';
//   }

//   setTimeout(() => {
//     popupContent.innerHTML = taskDesignContent;
//     popup.classList.remove('d-none');
//     startAnimation('secondPopup', 'popup2-show');
//   }, 0);
// }


