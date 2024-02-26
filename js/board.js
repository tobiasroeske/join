let tasks = [];

async function init() {
  await includeHTML();
  await loadTasks()
}

async function loadTasks() {
  try {
      tasks = JSON.parse(await getItem('tasks'));
  } catch (error) {
      console.error('Loading error:' + error);
  }
}

/**
 * Toggles the addTaskPopup and starts the slide in animation
 */
function toggleAddTask() {
  document.getElementById('popup').classList.toggle('d-none');
  setTimeout(() => startAnimation('addTaskPopup', 'popup-show'), 125);
  document.getElementById('popupClose').classList.remove('d-none');
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


