
let currentColumn = 'toDo';

async function init() {
  await includeHTML();
  await initAddTask();
}

async function newTask() {
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
      category: categoryInput.value,
      color: contactInput.value != '' ? assignedContact['color'] : '',
      priority: currentPriority,
      column: currentColumn
  };
  tasks.push(currentTask);
  await setItem('tasks', JSON.stringify(tasks));
  resetPopup();
}

function resetPopup() {
  resetAddTask()
  startAnimation('taskAdded', 'task-added-animation')
  setTimeout(() => {
    closePopup();
    startAnimation('taskAdded', 'task-added-animation');
  },1500);
}

/**
 * Toggles the addTaskPopup and starts the slide in animation
 */
function openAddTaskPopup(column) {
  document.getElementById('popup').classList.toggle('d-none');
  setTimeout(() => startAnimation('addTaskPopup', 'popup-show'), 125);
  document.getElementById('popupClose').classList.remove('d-none');
  currentColumn = column;
}

/**
 * closes the addTaskPopup 
 */
function closePopup () {
  setTimeout(() => document.getElementById('popup').classList.toggle('d-none'), 125);
  startAnimation('addTaskPopup', 'popup-show')
}

/**
 * starts the slide in animation from the right side to the left side
 * 
 * @param {string} id id of the DOM element on which the animation should start
 * @param {string} className the name of the class, which contains the animation
 */
// function startAnimation (id, className) {
//   let element = document.getElementById(id);
//   element.classList.toggle(className);
// }
