
let tasks = [];
let todos = [];
let inProgress = [];
let awaitingFeedback = [];
let done = [];
let urgent = [];

/**
 * resets the current user displays the loading screen until the data is laoded,
 * checks if the user is logged in, then
 * sorts the task by column and priority, display the closes due date,
 * creates the creeting message depending on the time of the day and greets the user
 */
async function init() {
    resetCurrentUser();
    toggleLoadingScreen();
    await includeHTML()
    await load();
    checkIfLoggedIn();
    sortTasks();
    displayTasks();
    displayDueDate();
    getGreetingMessage();
    displayGreetingScreen();
}

/**
 * sorts the task depending on its column and priority and pushes them in the
 * right array
 */
function sortTasks() {
    if (currentUser.tasks) {
        currentUser['tasks'].forEach(task => {
            if (task['currentColumn'] == 'toDo') {
                todos.push(task);
            } else if (task['currentColumn'] == 'inProgress') {
                inProgress.push(task);
            } else if (task['currentColumn'] == 'awaitFeedback') {
                awaitingFeedback.push(task);
            } else if (task['currentColumn'] == 'done') {
                done.push(task);
            }
            if (task['currentPriority'][0] == 'urgent') {
                urgent.push(task);
            }
        })
    }
    
}

/**
 * displays the tasks by its arryays length
 */
function displayTasks() {
    document.getElementById('tasksTodo').innerHTML = todos.length;
    document.getElementById('tasksDone').innerHTML = done.length;
    document.getElementById('tasksUrgent').innerHTML = urgent.length;
    document.getElementById('allTasks').innerHTML = currentUser['tasks'].length;
    document.getElementById('tasksInProgress').innerHTML = inProgress.length;
    document.getElementById('tasksAwaitingFeedback').innerHTML = awaitingFeedback.length;
    document.getElementById('userName').innerHTML = currentUser['name'];
}

/**
 * checks if there are any tasks and if so creates a new date from the stringified dueDate of the task
 * then formates the date in the english format and displays it
 */
function displayDueDate() {
    sortDueDates();
    if (currentUser['tasks'].length > 0) {
        let nearestDueDate = new Date(currentUser['tasks'][0]['dueDate']);
        let formatedDate = changeDateFormat(nearestDueDate);
        document.getElementById('dueDate').innerHTML = formatedDate;
    } else {
        let dueDate = document.getElementById('dueDate');
        document.getElementById('upcomingDeadline').innerHTML = '';
        dueDate.innerHTML = `So far no tasks created`;
        dueDate.style.textAlign = 'center';
    }
}

/**
 * changes the format to the english version
 * 
 * @param {date} date 
 * @returns 
 */
function changeDateFormat(date) {
    let month = date.toLocaleString('en-GB', {month: 'long'});
    let day = date.getDate();
    let year = date.getFullYear();
    let formatedDate = `${month} ${day}, ${year}`;
    return formatedDate;
}

/**
 * geht the task with the due date closest to the current date
 */
function sortDueDates() {
    currentUser['tasks'].sort((a, b) => new Date(a['dueDate']) - new Date(b['dueDate']));
}

/**
 * checks the current hour of the day
 * 
 * @returns the currnt hour
 */
function checkHour() {
    let currentDate = new Date();
    let currentHour = currentDate.getHours();
    return currentHour;
}

/**
 * creates a greeting message depending on the hour of the day
 */
function getGreetingMessage() {
    let currentHour = checkHour();
    let greeting = document.getElementById('greeting');
    if (currentHour >= 0 && currentHour <= 11) {
        greeting.innerHTML = 'Good Morning,';
    } else if (currentHour > 11 && currentHour < 14) {
        greeting.innerHTML = 'Good Day,'
    } else if (currentHour >= 14 && currentHour < 18) {
        greeting.innerHTML = 'Good afternoon,'
    } else {
        greeting.innerHTML = 'Good Evening,';
    }
}

/**
 * displays the greeting animation depending on the screen width
 */
function displayGreetingScreen() {
    if (window.innerWidth < 1050) {
        toggleClass('contentLeft', 'd-none');
        toggleClass('contentRight', 'd-flex');
        toggleClass('headline', 'd-none');
        toggleClass('summary', 'centered');
        toggleClass('loadingPopup', 'd-none');
        setTimeout(() => {
            toggleClass('loadingPopup', 'd-none');
            toggleClass('contentLeft', 'd-none');
            toggleClass('contentRight', 'd-flex');
            toggleClass('headline', 'd-none');
            toggleClass('summary', 'centered');
            toggleClass('loadingPopup', 'd-none');
        },1800)
    }
}

/**
 * if the screen size is greater than 1050px it toggles the display of the loading screen
 */
function toggleLoadingScreen() {
    if (window.innerWidth >= 1050) {
        toggleClass('loadingPopup', 'd-none');
    }
}

/**
 * changes the classname of a specific element
 * 
 * @param {string} id id of the element
 * @param {*string} className 
 */
function toggleClass(id, className) {
    document.getElementById(id).classList.toggle(className);
}