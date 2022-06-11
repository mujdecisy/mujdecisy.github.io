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
            renderCalendarPage();
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
            showModal("task-assign");
        }
        dailySlotElement.appendChild(item);
    });

    document.getElementsByClassName("daily-slot-shell")[0].scrollLeft = 0;

    
    let scrollSize = (today.getHours() > 3) ? (today.getHours()-3)*44 : 0;
    document.getElementsByClassName("daily-slot-shell")[0].scrollLeft += scrollSize;
}

// ........................................................ PAGE - PREVIEW
function clearCalendarPage() {
    document.getElementsByClassName("calendar")[0].innerHTML = "";
    document.getElementsByClassName("daily-slot")[0].innerHTML = "";
    document.getElementById("task-select").innerHTML = "";
    document.getElementsByClassName("todos")[0].innerHTML = "";
}

function renderCalendarPage() {
    loadTasksAndActions();
    clearCalendarPage();
    buildCalendarHeader();
    dateList = getCalendarDates(active);
    buildCalendar(dateList);
    buildDailySlot();
    fillTaskSelect();
    fillTodos(active);
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
    renderCalendarPage();
}