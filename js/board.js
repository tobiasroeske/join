/**
 * Toggles the addTaskPopup and starts the slide in animation
 */
function toggleAddTask() {
  document.getElementById('popup').classList.toggle('d-none');
  startAnimation('addTaskPopup', 'popup-show');
  document.getElementById('popupClose').classList.toggle('d-none');
}

/**
 * closes the addTaskPopup 
 */
function closePopup () {
  document.getElementById('popupClose').classList.toggle('d-none');
  document.getElementById('addTaskPopup').classList.toggle('show-popup');
}

/**
 * starts the slide in animation from the right side to the left side
 * 
 * @param {string} id id of the DOM element on which the animation should start
 * @param {string} className the name of the class, which contains the animation
 */
function startAnimation (id, className) {
  let element = document.getElementById(id);
  setTimeout(() => element.classList.toggle(className), 125)
}


// function toggleAddTask() {
//   document.getElementById('popup').classList.toggle('d-none');

//   let addTaskPopup = document.getElementById('addTaskPopup');
//   if (addTaskPopup.classList.contains('popup-show')) {
//     addTaskPopup.classList.remove('popup-show');
//   } else {
//     startAnimation('addTaskPopup', 'popup-show');
//   }
//   document.getElementById('popupClose').classList.toggle('d-none');
// }

// function closePopup() {
//   startAnimation('addTaskPopup', 'popup-show');
//   //document.getElementById('popup').style.display = 'none';
// }

