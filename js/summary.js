let currentUser;
let tasks = [];
async function init() {
    await includeHTML()
    await loadCurrentUser();
}

async function loadCurrentUser() {
    try {
        currentUser = JSON.parse(await getItem('currentUser'));
        tasks = JSON.parse(await getItem('tasks'));
    } catch (error) {
        console.error('Loading error:' + error);
    }
}