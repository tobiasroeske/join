let currentUser;
let tasks = [];
let todos = [];
let inProgress = [];
let awaitingFeedback = [];
let done = [];
let urgent = [];
async function init() {
    await includeHTML()
    await load();
    sortTasks();
    displayTasks();
    displayDueDate();
    getGreetingMessage();
    displayGreetingScreen();
}

async function load() {
    try {
        currentUser = JSON.parse(await getItem('currentUser'));
        tasks = JSON.parse(await getItem('tasks'));
    } catch (error) {
        console.error('Loading error:' + error);
    }
}

function sortTasks() {
    tasks.forEach(task => {
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

function displayTasks() {
    document.getElementById('tasksTodo').innerHTML = todos.length;
    document.getElementById('tasksDone').innerHTML = done.length;
    document.getElementById('tasksUrgent').innerHTML = urgent.length;
    document.getElementById('allTasks').innerHTML = tasks.length;
    document.getElementById('tasksInProgress').innerHTML = inProgress.length;
    document.getElementById('tasksAwaitingFeedback').innerHTML = awaitingFeedback.length;
    document.getElementById('userName').innerHTML = currentUser['name'];
}

function displayDueDate() {
    sortDueDates();
    let nearestDueDate = new Date(tasks[0]['dueDate']);
    let formatedDate = changeDateFormat(nearestDueDate);
    document.getElementById('dueDate').innerHTML = formatedDate;
}

function changeDateFormat(date) {
    let month = date.toLocaleString('en-GB', {month: 'long'});
    let day = date.getDay();
    let year = date.getFullYear();
    let formatedDate = `${month} ${day}, ${year}`;
    return formatedDate;
}

function sortDueDates() {
    tasks.sort((a, b) => new Date(a['dueDate']) - new Date(b['dueDate']));
}

function checkHour() {
    let currentDate = new Date();
    let currentHour = currentDate.getHours();
    return currentHour;
}

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

function displayGreetingScreen() {
    if (window.innerWidth < 1050) {
        toggleClass('contentLeft', 'd-none');
        toggleClass('contentRight', 'd-flex');
        toggleClass('headline', 'd-none');
        toggleClass('summary', 'centered');
        setTimeout(() => {
            toggleClass('contentLeft', 'd-none');
            toggleClass('contentRight', 'd-flex');
            toggleClass('headline', 'd-none');
            toggleClass('summary', 'centered');
        },1800)
    }
}

function toggleClass(id, className) {
    document.getElementById(id).classList.toggle(className);
}