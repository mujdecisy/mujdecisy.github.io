var today = new Date();
var active = today;

function getDateAsString(date) {
    return date.toISOString().substring(0, 10);
}

function getActiveDateAsString() {
    return getDateAsString(active);
}

function getCalendarDates() {
    let dates = [];
    let start = new Date(today.getTime());
    let end = new Date(today.getTime());

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
    let item = document.createElement("div");
    item.classList.add("calendar-item");
    item.innerHTML = date.getDate();
    item.onclick = () => {
        active = date;
        renderPreviewPage();
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

    let tasks = getFromStorage(LS_TOOL_PNP_TASKS);
    let actions = getFromStorage(LS_TOOL_PNP_ACTIONS);
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
            let modal = document.getElementsByClassName("action-modal")[0];
            modal.style["display"] = "block";
        }
        dailySlotElement.appendChild(item);
    });

    document.getElementsByClassName("daily-slot-shell")[0].scrollLeft = 0;

    
    let scrollSize = (today.getHours() > 3) ? (today.getHours()-3)*44 : 0;
    document.getElementsByClassName("daily-slot-shell")[0].scrollLeft += scrollSize;
}

function clearPreviewPage() {
    document.getElementsByClassName("calendar")[0].innerHTML = "";
    document.getElementsByClassName("daily-slot")[0].innerHTML = "";
}

function renderPreviewPage() {
    clearPreviewPage();
    buildCalendarHeader();
    dateList = getCalendarDates();
    buildCalendar(dateList);
    buildDailySlot();
    fillTaskSelect();
    fillTodos();
}

function addNewTask() {
    let tasks = getFromStorage(LS_TOOL_PNP_TASKS);
    tasks[document.getElementById("name").value] = {
        "name": document.getElementById("name").value,
        "period": document.getElementById("period").value,
        "slot": document.getElementById("slot").value,
        "color": document.getElementById("color").value,
    };
    persistToStorage(LS_TOOL_PNP_TASKS, tasks);
    fillTasks();
}

function fillTasks() {
    let tasks = getFromStorage(LS_TOOL_PNP_TASKS);
    let tasksElement = document.getElementsByClassName("task-list")[0];
    tasksElement.innerHTML = "";

    for (let k in tasks) {
        let item = document.createElement("div");
        item.classList.add("task-item");
        item.innerHTML = tasks[k].name + " > " + tasks[k].period + " > " + tasks[k].slot;
        item.style["background-color"] = tasks[k].color;
        item.style["cursor"] = "pointer";
        item.onclick = () => {
            document.getElementById("edit-task-name").value = tasks[k].name;
            let modal = document.getElementsByClassName("action-modal")[0];
            modal.style["display"] = "block";
        }
        tasksElement.appendChild(item);
    }
}

function fillTaskSelect() {
    let tasks = getFromStorage(LS_TOOL_PNP_TASKS);
    let tasksElement = document.getElementById("task-select");
    
    tasksElement.innerHTML = "";

    nullitem = document.createElement("option");
    nullitem.innerHTML = "none";
    nullitem.value = "none";
    tasksElement.appendChild(nullitem);

    for (let k in tasks) {
        let item = document.createElement("option");
        item.innerHTML = tasks[k].name;
        item.value = tasks[k].name;
        tasksElement.appendChild(item);
    }
}

function addNewAction() {
    let timeslot = document.getElementById("action-time-slot").value;
    let date = document.getElementById("action-date").value;
    let task = document.getElementById("task-select").value;

    let actions = getFromStorage(LS_TOOL_PNP_ACTIONS);

    if(!actions[date]) {
        actions[date] = {};
    }

    if (!actions[date][timeslot]) {
        if (task !== "none") {
            actions[date][timeslot] = task;
            persistToStorage(LS_TOOL_PNP_ACTIONS, actions);
        }
    } else {
        if (task === "none") {
            delete actions[date][timeslot];
            persistToStorage(LS_TOOL_PNP_ACTIONS, actions);
        } else {
            alert("This timeslot is already taken!");
        }
    }

    closeModal();
    renderPreviewPage();
}

function closeModal() {
    document.getElementsByClassName("action-modal")[0].style["display"] = "none";
}

function deleteTask() {
    let taskname = document.getElementById("edit-task-name");
    let tasks = getFromStorage(LS_TOOL_PNP_TASKS);
    let actions = getFromStorage(LS_TOOL_PNP_ACTIONS);
    delete tasks[taskname.value];
    for (let k in actions) {
        for (let l in actions[k]) {
            if (actions[k][l] === taskname.value) {
                delete actions[k][l];
            }
        }
    }
    persistToStorage(LS_TOOL_PNP_TASKS, tasks);
    persistToStorage(LS_TOOL_PNP_ACTIONS, actions);

    closeModal();
    fillTasks();
}

function getWeekDays() {
    let weekdays = [];
    let tempday = new Date(active);
    while(tempday.getDay() !== 1) {
        tempday.setDate(tempday.getDate() - 1);
        weekdays.push(getDateAsString(tempday));
    }
    tempday = new Date(active);
    while(tempday.getDay() !== 0) {
        tempday.setDate(tempday.getDate() + 1);
        weekdays.push(getDateAsString(tempday));
    }
    weekdays.push(getActiveDateAsString());
    weekdays.sort();

    return weekdays;
}

function fillTodos() {
    let todos = document.getElementsByClassName("todos")[0];
    todos.innerHTML = "";

    let tasks = getFromStorage(LS_TOOL_PNP_TASKS);
    let actions = getFromStorage(LS_TOOL_PNP_ACTIONS);
    let weekdays = getWeekDays();

    for (let k in tasks) {
        task = tasks[k];
        if (task.period === "daily") {
            let done_count = 0;
            for (let k1 in actions[getActiveDateAsString()]) {
                action = actions[getActiveDateAsString()][k1];
                if (action === task.name) {
                    done_count++;
                }
            }
            let item = document.createElement("div");
            item.classList.add("todo-item");
            item.innerHTML = task.name + " (" + done_count + "/" + task.slot + ")";
            item.style["background-color"] = task.color;
            todos.appendChild(item);
        } else if (task.period === "weekly") {
            let done_count = 0;
            weekdays.forEach(day => {
                for (let k1 in actions[day]) {
                    action = actions[day][k1];
                    if (action === task.name) {
                        done_count++;
                    }
                }
            });
            let item = document.createElement("div");
            item.classList.add("todo-item");
            item.innerHTML = task.name + " (" + done_count + "/" + task.slot + ")";
            item.style["background-color"] = task.color;
            todos.appendChild(item);
        }
    }
}