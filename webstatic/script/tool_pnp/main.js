var today = new Date();
var active = today;
var tasks = null;
var actions = null;

var currentTaskName = null;
var currentTaskHistory = null;

// ........................................................ DATA MANIPULATION
function loadTasksAndActions() {
    tasks = getFromStorage(LS_TOOL_PNP_TASKS);
    actions = getFromStorage(LS_TOOL_PNP_ACTIONS);
}

function updateTasksAndActions() {
    persistToStorage(LS_TOOL_PNP_TASKS, tasks);
    persistToStorage(LS_TOOL_PNP_ACTIONS, actions);
}

// ........................................................ DATE UTILS
function getActiveDateAsString() {
    return getDateAsString(active);
}

function getCalendarDates(date) {
    let dates = [];
    let start = new Date(date.getTime());
    let end = new Date(date.getTime());

    while(start.getMonth() === today.getMonth() || start.getDay() != 0) {
        dates.push(new Date(start.getTime()));
        start.setDate(start.getDate() - 1);
    }
    dates.shift();

    while(end.getMonth() === today.getMonth() || end.getDay() != 1) {
        dates.push(new Date(end.getTime()));
        end.setDate(end.getDate() + 1);
    }

    dates.sort((a, b) => a.getTime() - b.getTime());
    return dates;
}

