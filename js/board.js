
let currentColumn = 'toDo';
/**
 * loads the html template for the addTask popup 
 * then loads the contacts and the tasks from the remote storage
 */
async function init() {
  await includeHTML();
  await initAddTask();
}

/**
 * creates a new Task and saves it in the currentTask variable
 * then sends the tasks array to the remote storage
 * in the end resets the popup
 */
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

/**
 * resets the form starts the slide animation and closes after a delay the popup
 */
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

function startAnimation (id, className) {
  let element = document.getElementById(id);
  element.classList.toggle(className);
}



function openSecondPopup() {
  let popup = document.getElementById('secondPopup');
  let taskDesignContent = document.querySelector('.task-design').innerHTML;
  let popupContent = popup.querySelector('.popup2-content');
  let taskTitle = popupContent.querySelector('.task-title'); 
  
  if (taskTitle) {
    taskTitle.style.fontSize = '50px';
  }
  
  setTimeout(() => {
    popupContent.innerHTML = taskDesignContent;
    popup.classList.remove('d-none');
    startAnimation('secondPopup', 'popup2-show');
  }, 0);
}


function closeSecondPopup() {
  let popup = document.getElementById('secondPopup');
  popup.classList.add('popup2-hide');
  setTimeout(() => {
    popup.classList.add('d-none');
    popup.classList.remove('popup2-hide');
  }, 300);
}

const card = document.getElementById('dragging');
const dropZone = document.getElementById('drop-zone');

card.addEventListener('dragstart', function(event) {
  console.log(event)
})


dropZone.addEventListener('dragover', function(event) {
event.preventDefault()
})
dropZone.addEventListener('drop', function (event)
{
  dropZone.prepend(dragging)
})