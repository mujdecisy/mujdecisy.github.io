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
function getDateAsString(date) {
    return date.toISOString().substring(0, 10);
}

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

function getWeekDays(date) {
    let weekdays = [];
    let tempday = new Date(date);
    while(tempday.getDay() !== 1) {
        tempday.setDate(tempday.getDate() - 1);
        weekdays.push(getDateAsString(tempday));
    }
    tempday = new Date(date);
    while(tempday.getDay() !== 0) {
        tempday.setDate(tempday.getDate() + 1);
        weekdays.push(getDateAsString(tempday));
    }
    weekdays.push(getDateAsString(date));
    weekdays.sort();
    return weekdays;
}

function getStringDatesBetween(date1, date2) {
    let dates = [];
    let temp = new Date(date1);
    while(temp.getTime() <= date2.getTime()) {
        dates.push( getDateAsString(temp) );
        temp.setDate(temp.getDate() + 1);
    }
    return dates;
}

// ........................................................ COMPONENT - CALENDAR
function buildCalendarHeader() {
    let calendarElement = document.getElementsByClassName("calendar")[0];
    let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    days.forEach(e => {
        let item = document.createElement("div");
        item.classList.add("calendar-header-item");
        item.innerHTML = e;
        calendarElement.appendChild(item);
    });
}

function buildCalendarItem(date) {
    let todos = getTodos(date);
    let status = "";
    if (getDateAsString(date) <= getDateAsString(today) && Object.keys(todos).length > 0) {
        status = "☀";
        for (let k in todos) {
            if (tasks[k].slot > todos[k]["done_count"]) {
                status = "🌧";
                break;
            }
        }
    }

    let item = document.createElement("div");
    item.classList.add("calendar-item");
    item.innerHTML = date.getDate() + " " + status;
    item.onclick = () => {
        if (date.getMonth() === today.getMonth()) {
            active = date;
            renderPreviewPage();
        }
    }
    item.style["background-color"] = (date.getMonth() === today.getMonth()) ? "var(--g4)" : "var(--g5)";
    item.style["border"] = (date.getTime() === active.getTime()) ? "2px solid red" : "2px solid transparent";
    return item;
}

function buildCalendar(dateList) {
    let calendarElement = document.getElementsByClassName("calendar")[0];
    dateList.forEach(e => {
        calendarElement.appendChild(buildCalendarItem(e));
    });
}

// ........................................................ COMPONENT - TIMESLOT
function getTimeSlots() {
    let timeSlots = [];
    let d = new Date(today.getTime());
    d.setHours(0);
    d.setMinutes(0);

    i = 0;
    while(i<48) {
        let slot_tag = d.toTimeString().substring(0, 5);
        timeSlots.push(slot_tag);
        d = new Date(d.getTime() + 30*60*1000);
        i++;
    }
    
    return timeSlots;
}

function buildDailySlot() {
    let dailySlotElement = document.getElementsByClassName("daily-slot")[0];
    let timeSlots = getTimeSlots();

    let daily_slots = {};
    if (actions[getActiveDateAsString()]) {
        daily_slots = actions[getActiveDateAsString()];
    }

    timeSlots.forEach(e => {
        let item = document.createElement("div");
        if (e in daily_slots) {
            item.style["background-color"] = tasks[daily_slots[e]].color;
            item.style["color"] = "black";
        }
        item.classList.add("daily-slot-item");
        item.innerHTML = e;
        item.onclick = () => {
            document.getElementById("action-time-slot").value = e;
            document.getElementById("action-date").value = getActiveDateAsString();
            let modal = document.getElementsByClassName("pnp-modal")[0];
            modal.style["display"] = "block";
        }
        dailySlotElement.appendChild(item);
    });

    document.getElementsByClassName("daily-slot-shell")[0].scrollLeft = 0;

    
    let scrollSize = (today.getHours() > 3) ? (today.getHours()-3)*44 : 0;
    document.getElementsByClassName("daily-slot-shell")[0].scrollLeft += scrollSize;
}

// ........................................................ PAGE - PREVIEW
function clearPreviewPage() {
    document.getElementsByClassName("calendar")[0].innerHTML = "";
    document.getElementsByClassName("daily-slot")[0].innerHTML = "";
    document.getElementById("task-select").innerHTML = "";
    document.getElementsByClassName("todos")[0].innerHTML = "";
}

function renderPreviewPage() {
    loadTasksAndActions();
    clearPreviewPage();
    buildCalendarHeader();
    dateList = getCalendarDates(active);
    buildCalendar(dateList);
    buildDailySlot();
    fillTaskSelect();
    fillTodos(active);
}

// ........................................................ PAGE - EDIT
function clearEditPage() {
    document.getElementsByClassName("task-list")[0].innerHTML = "";
}

function renderEditPage() {
    loadTasksAndActions();
    clearEditPage();
    fillTasks();
}



// ........................................................ COMPONENT - TASK
function addNewTask() {
    let days = [];
    [1,2,3,4,5,6,7].forEach(x => {
        if (document.getElementById("D" + x).checked) {
            days.push(x);
        }
    });
    tasks[document.getElementById("name").value] = {
        "name": document.getElementById("name").value,
        "days": days,
        "slot": parseInt(document.getElementById("slot").value),
        "color": document.getElementById("color").value,
        "start": getActiveDateAsString()
    };
    updateTasksAndActions();
    renderEditPage();
}

function fillTasks() {
    let tasksElement = document.getElementsByClassName("task-list")[0];

    for (let k in tasks) {
        let item = document.createElement("div");
        item.classList.add("task-item");
        item.innerHTML = tasks[k].name + " > " + tasks[k].days.join(",") + " > " + tasks[k].slot + " > " + tasks[k].start;
        item.style["background-color"] = tasks[k].color;
        item.style["cursor"] = "pointer";
        item.onclick = () => {
            window.location.href = item.href = "/tool/pnp/detail?task_name=" + k;
        }
        tasksElement.appendChild(item);
    }
}


// ........................................................ COMPONENT - TASK SELECT
function fillTaskSelect() {
    let tasksElement = document.getElementById("task-select");

    let nullitem = document.createElement("option");
    nullitem.innerHTML = "none";
    nullitem.value = "none";
    tasksElement.appendChild(nullitem);

    for (let k in tasks) {
        if (tasks[k].start <= getActiveDateAsString()) {
            let item = document.createElement("option");
            item.innerHTML = tasks[k].name;
            item.value = tasks[k].name;
            tasksElement.appendChild(item);
        }
    }
}

// ........................................................ COMPONENT - MODAL
function closeModal() {
    document.getElementsByClassName("pnp-modal")[0].style["display"] = "none";
}

// ........................................................ EVENT - ADD ACTION
function addNewAction() {   let timeslot = document.getElementById("action-time-slot").value;
    let date = document.getElementById("action-date").value;
    let task = document.getElementById("task-select").value;

    if(!actions[date]) {
        actions[date] = {};
    }

    if (!actions[date][timeslot]) {
        if (task !== "none") {
            actions[date][timeslot] = task;
        }
    } else {
        if (task === "none") {
            delete actions[date][timeslot];
        } else {
            alert("This timeslot is already taken!");
        }
    }

    updateTasksAndActions();
    closeModal();
    renderPreviewPage();
}

// ........................................................ EVENT - DELETE TASK
function deleteTask() {
    delete tasks[currentTaskName];
    for (let k in actions) {
        for (let l in actions[k]) {
            if (actions[k][l] === currentTaskName) {
                delete actions[k][l];
            }
        }
    }
    updateTasksAndActions();
    window.location.href = "/tool/pnp/edit";
}


// ........................................................ COMPONENT - TODOS
function getTodos(date) {
    let todos = {};
    let day = (date.getDay() === 0)? 7 : date.getDay();

    let dateStr = getDateAsString(date);
    let dayActions = actions[dateStr];
    
    for (let k in tasks) {
        if (!tasks[k].days.includes(day) || dateStr < tasks[k].start) {
            continue;
        }

        let done_count = 0;
        for (let key in dayActions) {
            if (dayActions[key] === tasks[k].name) {
                done_count += 1;
            }
        }

        todos[k] = {
            "done_count" : done_count
        };
    }

    return todos;
}

function createTodoItem(task, done_count) {
    let item = document.createElement("div");
    item.classList.add("todo-item");
    item.innerHTML = task.name + " (" + done_count + "/" + task.slot + ")";
    item.style["background-color"] = task.color;
    return item;
}

function fillTodos(date) {
    let todos = document.getElementsByClassName("todos")[0];
    todos.innerHTML = "";

    let todo_list = getTodos(date);

    for (const [key, value] of Object.entries(todo_list)) {
        todos.appendChild(createTodoItem(tasks[key], value["done_count"]));
    }
}

// ------------------------------------------------------------ PAGE - DETAIL
function renderDetailPage() {
    currentTaskName = new URLSearchParams(window.location.search).get("task_name");
    loadTasksAndActions();
    currentTaskHistory = calculateTaskHistory();
    createTaskTable();
    createChainItem();
}

// ------------------------------------------------------------ COMPONENT - CHAIN
function createChainItem() {
    let dates = Object.keys(currentTaskHistory);
    dates.sort();
    let chain = document.getElementsByClassName("chain")[0];

    dates.forEach(date => {
        let item = document.createElement("div");
        item.classList.add("chain-item");
        if (currentTaskHistory[date] === 0) {
            item.innerHTML = "🟠";
        } else {
            item.innerHTML = "🟢";
        }
        chain.appendChild(item);
    });

    for (let i=0; i<40-dates.length; i++) {
        let item = document.createElement("div");
        item.classList.add("chain-item");
        item.innerHTML = "⚪";
        chain.appendChild(item);
    }
    
}


// ------------------------------------------------------------ COMPONENT - TASK TABLE
function createTaskTable() {
    let task = tasks[currentTaskName];

    let dates = Object.keys(currentTaskHistory);
    dates.sort();

    let successRate = 0;
    let positive = 100/40;
    let negative = positive*-0.8;

    dates.forEach(date=>{
        successRate += (currentTaskHistory[date] === 1) ? positive : negative;
        if (successRate > 100) {
            successRate = 100;
        }
        if (successRate < 0) {
            successRate = 0;
        }
    });
    
    document.getElementById("name").innerHTML = task.name;
    document.getElementById("slot").innerHTML = task.slot;
    document.getElementById("period").innerHTML = task.days.join("-");
    document.getElementById("start_date").innerHTML = task.start;
    document.getElementById("success_rate").innerHTML = successRate.toFixed(2) + "%";

}

// ------------------------------------------------------------ EVENT - TASK HISTORY
function calculateTaskHistory() {
    let task = tasks[currentTaskName];
    let taskStart = new Date(task.start);

    let strDates = getStringDatesBetween(taskStart, today);
    let history = {};

    let done = 0;
    strDates.forEach(date => {
        for (let timekey in actions[date]) {
            if (actions[date][timekey] === currentTaskName) {
                done++;
            }
        }
        if (task.period === "daily") {
            history[date] = (done >= task.slot)? 1:0;
            done = 0;
        } else {
            if (new Date(date).getDay() == 0) {
                history[date] = (done >= task.slot)? 1:0;
                done = 0;
            }
        }
    });

    return history;   
}
