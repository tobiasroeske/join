let currentUser;
let tasks = [];
let todos = [];
let inProgress = [];
let awaitingFeedback = [];
let done = [];
let urgent = [];
async function init() {
    await includeHTML()
    await loadCurrentUser();
    sortTasks();
    displayTasks();
}

async function loadCurrentUser() {
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
        } else if (task['currentColumn'] == 'awaitingFeedback') {
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
}