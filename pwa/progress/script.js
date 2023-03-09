//////////////////////////////////////////////////////////////////////////
///////////////////////////////// UTILITY ////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function dateToString(dateDate) {
    const year = dateDate.getFullYear();
    const month = dateDate.getMonth() + 1;
    const day = dateDate.getDate();
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return dateString;
}

function changeTargetDate(paramDate) {
    window.location.href = `/pwa/progress/index.html?targetDate=${dateToString(paramDate)}`
}

function checkNewTask(taskDict, taskName, taskColor) {
    if (taskName.length > 20) {
        throw new Error("Task name can not be longer than 20 characters.")
    }

    for (let taskId in taskDict) {
        if (taskDict.hasOwnProperty(taskId)) {
            const taskAttrs = taskDict[taskId];
            if (taskAttrs.name === taskName) {
                throw new Error("Name has already been obtained by another task.")
            }
            if (taskAttrs.color === taskColor) {
                throw new Error("Color has already been obtained by another task.")
            }
        }
    }
}


function saveTaskToLocalStorage(taskId, taskName, slotCount, daysOfWeek, startDate, color) {
    const taskDefinition = {
        id: taskId,
        name: taskName,
        slotCount: slotCount,
        daysOfWeek: daysOfWeek,
        startDate: startDate,
        color: color
    };
    const taskdefs = JSON.parse(localStorage.getItem(K_TASKDEFS) || "{}");

    checkNewTask(taskdefs, taskName, color);

    taskdefs[taskId] = taskDefinition;
    localStorage.setItem(K_TASKDEFS, JSON.stringify(taskdefs));
}

function saveTaskLogToLocalStorage(date, time, taskId) {
    // Parse the existing task log from local storage or create an empty object if it doesn't exist yet
    let taskLog = JSON.parse(localStorage.getItem(K_TASKLOG) || "{}");


    // Delete the time key if the taskId is an empty string and the log already exists for that date and time
    if (taskId === '') {
        if (taskLog[date] && taskLog[date][time]) {
            delete taskLog[date][time];
        }
    } else {
        // Create or update the log item for the given date, time, and task ID
        if (!taskLog[date]) {
            taskLog[date] = {};
        }
        if (!taskLog[date][time]) {
            taskLog[date][time] = 0;
        }
        taskLog[date][time] = parseInt(taskId);
    }

    // Stringify the updated task log and save it back to local storage
    localStorage.setItem(K_TASKLOG, JSON.stringify(taskLog));
}

function getTaskDefs(dayOfWeek = null, targetDate = null) {
    let taskDefs = JSON.parse(localStorage.getItem(K_TASKDEFS) || "{}");
    const taskList = [];
    for (let taskId in taskDefs) {
        if (
            (targetDate == null || taskDefs[taskId].startDate <= dateToString(targetDate))
            &&
            (dayOfWeek === null || taskDefs[taskId].daysOfWeek.includes(dayOfWeek))
        ) {
            taskList.push(taskDefs[taskId]);
            taskDefs[taskId].color = `var(--${taskDefs[taskId].color})`
        }
    }
    return taskList;
}

function getDailyTasksWithDoneCounts(dateP = null, taskDefsP = null) {
    let taskDefs = null;
    let taskLog = null;
    if (dateP === null) {
        taskDefs = TARGET_TASKDEFS;
        taskLog = TARGET_TASKLOG;
    } else {
        taskDefs = taskDefsP;
        taskLog = JSON.parse(localStorage.getItem(K_TASKLOG) || "{}")[dateToString(dateP)] || {};
    }

    const doneCounts = {};
    taskDefs.forEach(e => {
        doneCounts[e.id] = 0
    })

    for (let time in taskLog) {
        doneCounts[taskLog[time]] += 1
    }

    taskDefs.forEach(e => {
        e.doneCount = doneCounts[e.id];
    });
    return taskDefs;
}

function getDailySuccessOfTask(taskId) {
    const taskDef = JSON.parse(localStorage.getItem(K_TASKDEFS) || "{}")[taskId];
    const taskLog = JSON.parse(localStorage.getItem(K_TASKLOG) || "{}");

    let datePivot = new Date(taskDef.startDate);
    const successArray = [];

    const today = dateToString(new Date());

    while (successArray.length < 35) {
        if (taskDef.daysOfWeek.includes(datePivot.getDay().toString())) {
            const dateString = dateToString(datePivot);
            let succeed = 0;

            if (dateString > today) {
                succeed = 0
            } else {
                let doneCount = 0;
                if (dateString in taskLog) {
                    for (let time in taskLog[dateString]) {
                        if (taskLog[dateString][time] === taskId) {
                            doneCount += 1;
                        }
                    }
                }
                succeed = (doneCount >= taskDef.slotCount) ? 1 : -1
            }

            successArray.push({
                date: dateString,
                succeed
            });
        }

        datePivot.setDate(datePivot.getDate() + 1);
    }

    return successArray;
}

function calculateSuccessRate(dailySuccessArray) {
    const stepSize = 100 / 28;
    let point = 0;
    for (const dailySuccess of dailySuccessArray) {
        if (dailySuccess.succeed === 1) {
            point += stepSize;
        } else if (dailySuccess.succeed === -1) {
            point -= stepSize * 3 / 4;
        } else {
            break;
        }
    }
    return Math.min(Math.max(point, 0), 100);
}

function clearTaskFromLocalStorage(taskId) {
    let taskLog = JSON.parse(localStorage.getItem(K_TASKLOG) || "{}");
    for (const date in taskLog) {
        for (const time in taskLog[date]) {
            if (taskLog[date][time] === taskId) {
                delete taskLog[date][time];
            }
        }
    }
    localStorage.setItem(K_TASKLOG, JSON.stringify(taskLog));

    let taskDefs = JSON.parse(localStorage.getItem(K_TASKDEFS) || "{}");
    delete taskDefs[taskId];
    localStorage.setItem(K_TASKDEFS, JSON.stringify(taskDefs));
}

//////////////////////////////////////////////////////////////////////////
////////////////////////////// NAVIGATION ////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function renderNavigationBarById() {
    const navigationBar = document.createElement('nav');

    const appName = document.createElement('a');
    appName.textContent = 'Progress.';
    appName.style.borderBottom = "5px solid gold";
    appName.className = "no-deco nav-header";
    appName.href = '/pwa/progress/index.html';


    const additionals = document.createElement("div");
    additionals.id = "nav-additions"

    navigationBar.appendChild(appName);
    navigationBar.appendChild(additionals);

    document.getElementById("navigation").replaceChildren(navigationBar);
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////// INDEXPAG ////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function renderAdditionalsIndexPage() {
    const taskListButton = document.createElement("a");
    taskListButton.href = "/pwa/progress/index.html?page=task-list"
    taskListButton.className = "btn btn-tp btn-ul";
    taskListButton.textContent = "All Tasks";

    document.getElementById("nav-additions").appendChild(taskListButton);
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////// CALENDAR ////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function getCalendarDates(date) {
    // Get the year and month of the given date
    const year = date.getFullYear();
    const month = date.getMonth();

    // Get the first day of the month
    const firstDay = new Date(year, month, 1);

    // Get the day of the week of the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();

    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Calculate the number of days from the previous month that will appear in the calendar
    const daysFromPrevMonth = (firstDayOfWeek + 6) % 7;

    // Calculate the number of days from the next month that will appear in the calendar
    const daysFromNextMonth = 7 - ((daysFromPrevMonth + daysInMonth) % 7);

    // Create an array to hold all the dates that will appear in the calendar
    const calendarDates = [];

    // Add the dates from the previous month to the array
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
        const date = new Date(year, month, -i);
        calendarDates.push(date);
    }

    // Add the dates from the current month to the array
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        calendarDates.push(date);
    }

    // Add the dates from the next month to the array
    for (let i = 1; i <= daysFromNextMonth; i++) {
        const date = new Date(year, month + 1, i);
        calendarDates.push(date);
    }

    // Divide the dates into weeks (arrays of 7 dates)
    const weeks = [];
    for (let i = 0; i < calendarDates.length; i += 7) {
        weeks.push(calendarDates.slice(i, i + 7));
    }

    // Return the array of weeks
    return weeks;
}

function renderCalendarById(paramDate) {
    const datesArray = getCalendarDates(paramDate);

    // Find the number of rows and columns in the array
    const numRows = datesArray.length;
    const numCols = datesArray[0].length;

    // Create a table element to hold the calendar
    const table = document.createElement("table");

    // Create a header row with the days of the week
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const headerRow = document.createElement("tr");
    for (const element of daysOfWeek) {
        const headerCell = document.createElement("th");
        headerCell.textContent = element;
        headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);
    const today = new Date();

    // Create a table row for each week
    for (let i = 0; i < numRows; i++) {
        const week = datesArray[i];
        const row = document.createElement("tr");

        // Create a table cell for each day in the week
        for (let j = 0; j < numCols; j++) {
            const date = week[j];
            const cell = document.createElement("td");

            const cellBox = document.createElement("div");
            cellBox.style.display = "flex";
            cellBox.style.justifyContent = "space-between";
            cellBox.style.width = "100%";

            const dateString = document.createElement("span");
            dateString.textContent = date.getDate();
            const icon = document.createElement("i");

            const tasks = getDailyTasksWithDoneCounts(
                date,
                getTaskDefs(date.getDay(), date)
            );

            let allDone = true;

            for (const task of tasks) {
                if (task.doneCount < task.slotCount) {
                    allDone = false;
                    break;
                }
            }

            if (tasks.length > 0 && dateToString(date) <= dateToString(today)) {
                icon.className = (allDone) ? "fa-solid fa-sun" : "fa-solid fa-cloud-showers-heavy";
            }

            cellBox.appendChild(dateString);
            cellBox.appendChild(icon);

            cell.appendChild(cellBox);

            // Highlight today's date
            if (date.toDateString() === paramDate.toDateString()) {
                cell.classList.add("cal-in-day");
            }
            if (date.getMonth() === paramDate.getMonth()) {
                cell.classList.add("cal-in-month");
                cell.onclick = function () {
                    changeTargetDate(date);
                }
            }
            cell.classList.add("cal-item");

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    table.classList.add("cal-table");

    const calendar = document.getElementById("calendar");
    calendar.replaceChildren(table);
}

function renderCalendarHeaderById(paramDate) {
    // Create the container element for the header
    const header = document.createElement("div");
    header.classList.add("cal-header")

    // Create the navigation button for the previous month
    const prevMonthBtn = document.createElement("button");
    prevMonthBtn.className = "btn btn-sm";
    prevMonthBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prevMonthBtn.addEventListener("click", () => {
        paramDate.setMonth(paramDate.getMonth() - 1);
        changeTargetDate(paramDate);
    });

    // Create the navigation button for the next month
    const nextMonthBtn = document.createElement("button");
    nextMonthBtn.className = "btn btn-sm";
    nextMonthBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    nextMonthBtn.addEventListener("click", () => {
        paramDate.setMonth(paramDate.getMonth() + 1);
        changeTargetDate(paramDate);
    });

    // Create the month and year text element
    const monthYearText = document.createElement("div");
    monthYearText.textContent = `${paramDate.toLocaleString('default', { month: 'long' })} ${paramDate.getFullYear()}`;
    monthYearText.style.textAlign = "center";
    monthYearText.style.fontWeight = "bold";

    // Add the navigation buttons and month/year text to the header container
    header.appendChild(prevMonthBtn);
    header.appendChild(monthYearText);
    header.appendChild(nextMonthBtn);

    // Add the header container to the document body
    document.getElementById("calendar-header").replaceChildren(header);
}


//////////////////////////////////////////////////////////////////////////
//////////////////////////////// TIMESLOT ////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function renderTimeslotById() {
    // Create a container element for the time slots
    const container = document.createElement("div");
    container.classList.add("slot-cont");

    // Loop through all the half-hour time slots of the day (48 in total)
    for (let i = 0; i < 48; i++) {
        // Calculate the hour and minute values for the current time slot
        const hour = Math.floor(i / 2);
        const minute = (i % 2) * 30;

        // Create a new div element to represent the current time slot
        const timeContainer = document.createElement("div");
        timeContainer.classList.add("slot-item");

        // Create a new div element to represent the current time
        const time = document.createElement("div");
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        time.textContent = timeStr;

        if (timeStr in TARGET_TASKLOG) {
            for (const el of TARGET_TASKDEFS) {
                if (el.id === TARGET_TASKLOG[timeStr]) {
                    timeContainer.style.backgroundColor = el.color;
                    break;
                }
            }
        }

        // Add the time div element to the time slot div element
        timeContainer.appendChild(time);

        timeContainer.onclick = function () {
            window.location.href = `/pwa/progress/index.html?page=assignment&targetDate=${dateToString(TARGET_DATE)}&time=${timeStr}`
        }

        // Add the time slot div element to the container div element
        container.appendChild(timeContainer);
    }

    document.getElementById("timeslot").replaceChildren(container);
}


//////////////////////////////////////////////////////////////////////////
//////////////////////////////// TASKLIST ////////////////////////////////
//////////////////////////////////////////////////////////////////////////


function renderTaskListById(tasks) {
    // Create a new container div for the task list.
    const container = document.createElement('div');

    // Loop through each task object in the array.
    for (const task of tasks) {
        // Create a new div element for each task.
        const taskElem = document.createElement('div');
        taskElem.classList.add('task');

        // Create a new div element for the task color and set its color.
        const colorElem = document.createElement('div');
        colorElem.classList.add('task-color');
        colorElem.style.setProperty('--task-color', task.color);

        // Create a new div element for the task name and set its text content.
        const nameElem = document.createElement('div');
        nameElem.classList.add('task-name');
        nameElem.textContent = task.name;

        // Create a new div element for the task counts and set its text content.
        const countsElem = document.createElement('div');
        countsElem.classList.add('task-counts');
        countsElem.textContent = `${task.doneCount}/${task.slotCount}`;

        // Append the color, name, and counts elements to the task element.
        taskElem.appendChild(colorElem);
        taskElem.appendChild(nameElem);
        taskElem.appendChild(countsElem);

        // Append the task element to the container element.
        container.appendChild(taskElem);
    }

    if (tasks.length > 0) {
        // Get the sum of all doneCounts and requiredCounts in the task array.
        const doneCount = tasks.reduce((sum, task) => sum + task.doneCount, 0);
        const requiredCount = tasks.reduce((sum, task) => sum + task.slotCount, 0);

        // Create a new div element for the task total and set its text content.
        const totalElem = document.createElement('div');
        totalElem.classList.add('task-total');
        totalElem.textContent = `Total: ${doneCount}/${requiredCount}`;

        // Append the total element to the container element.
        container.appendChild(totalElem);
    } else {
        const msgElement = document.createElement("p");
        msgElement.textContent = "There is no task to do for today."
        msgElement.style.textAlign = "center";
        const aElement = document.createElement("a");
        aElement.href = "/pwa/progress/index.html?page=task-add"
        aElement.textContent = "Create New Task"
        aElement.className = "btn btn-sm"
        aElement.style.maxWidth = "350px";
        aElement.style.margin = "0px auto";
        container.appendChild(msgElement);
        container.appendChild(aElement);
    }



    // Replace the child elements of the tasklist element with the container element.
    document.getElementById("tasklist").replaceChildren(container);
}

//////////////////////////////////////////////////////////////////////////
///////////////////////////// TASKADDFORM ////////////////////////////////
//////////////////////////////////////////////////////////////////////////


function renderTaskFormById() {

    // Create a form element
    const form = document.createElement("form");
    form.classList.add("task-form");

    // Create input element for task name
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Task Name";
    const nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("placeholder", "Enter task name");
    nameInput.setAttribute("required", true);
    form.appendChild(nameLabel);
    form.appendChild(nameInput);

    // Create select element for days to do in a week
    const daysLabel = document.createElement("label");
    daysLabel.textContent = "Days to do in a week";
    const daysInput = document.createElement("select");
    daysInput.setAttribute("multiple", true);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let counter = 1;
    for (const day of days) {
        const option = document.createElement("option");
        option.setAttribute("value", counter);
        counter = (counter + 1) % 7;
        option.textContent = day;
        daysInput.appendChild(option);
    }
    form.appendChild(daysLabel);
    form.appendChild(daysInput);

    // Create input element for task start date
    const startDateLabel = document.createElement("label");
    startDateLabel.textContent = "Start At";
    const startDateInput = document.createElement("input");
    startDateInput.setAttribute("type", "date");
    startDateInput.setAttribute("required", true);
    form.appendChild(startDateLabel);
    form.appendChild(startDateInput);

    // Create input element for slots to do daily
    const slotsLabel = document.createElement("label");
    slotsLabel.textContent = "Slots to do daily";
    const slotsInput = document.createElement("input");
    slotsInput.setAttribute("type", "number");
    slotsInput.setAttribute("min", 1);
    slotsInput.setAttribute("max", 24);
    slotsInput.setAttribute("placeholder", "Enter number of slots");
    slotsInput.setAttribute("required", true);
    form.appendChild(slotsLabel);
    form.appendChild(slotsInput);

    // Create select element for color
    const colorLabel = document.createElement("label");
    colorLabel.textContent = "Color";
    const colorInput = document.createElement("select");
    const colors = ["red", "blue", "yellow", "green", "pink"];
    for (const color of colors) {
        const option = document.createElement("option");
        option.setAttribute("value", color);
        option.innerText = color.toUpperCase();
        option.style.backgroundColor = color;
        colorInput.appendChild(option);
    }
    form.appendChild(colorLabel);
    form.appendChild(colorInput);

    // Create submit button
    const submitButton = document.createElement("button");
    submitButton.style.marginTop = "30px";
    submitButton.classList.add("btn");
    submitButton.setAttribute("type", "submit");
    submitButton.textContent = "Create Task";
    form.appendChild(submitButton);


    // Add event listener to close modal on submit
    form.addEventListener("submit", event => {
        event.preventDefault();
        const selectedValues = Array.from(daysInput.selectedOptions, option => option.value.toString());
        const date = new Date();
        try {
            saveTaskToLocalStorage(
                parseInt(date.getTime()),
                nameInput.value,
                parseInt(slotsInput.value),
                selectedValues.join(""),
                startDateInput.value,
                colorInput.value
            );
            window.location.href = "/pwa/progress/index.html";
        } catch (error) {
            alert(error);
        }
    });


    document.getElementById("taskaddform").replaceChildren(form);
}


//////////////////////////////////////////////////////////////////////////
//////////////////////////// TASKLISTPAGE ////////////////////////////////
//////////////////////////////////////////////////////////////////////////
function getDaysOfWeek(activeDays) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysOfWeekElement = document.createElement('div');
    daysOfWeekElement.classList.add('days-of-week');

    for (let i = 1; i < daysOfWeek.length + 1; i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = daysOfWeek[i % 7].charAt(0);

        if (activeDays.includes((i % 7).toString())) {
            dayElement.style.color = "black";
            dayElement.style.fontWeight = "bolder";
            dayElement.style.textDecoration = "underline";
        } else {
            dayElement.style.color = "gray";
            dayElement.style.fontWeight = "lighter";
        }

        daysOfWeekElement.appendChild(dayElement);
    }

    return daysOfWeekElement;
}


function renderTaskListPageById(tasks) {
    const taskListElement = document.getElementById('tasklistp');

    for (let task of tasks) {
        // Add the task color bullet
        const colorBulletElement = document.createElement('div');
        colorBulletElement.classList.add('task-color');
        colorBulletElement.style.setProperty('--task-color', task.color);
        taskListElement.appendChild(colorBulletElement);

        // Add the task name
        const nameElement = document.createElement('div');
        nameElement.textContent = task.name;
        nameElement.style.textOverflow = "ellipsis";
        taskListElement.appendChild(nameElement);

        // Add active days of the week
        taskListElement.appendChild(getDaysOfWeek(task.daysOfWeek));

        // Add slot count of a day
        const slotElement = document.createElement("div");
        slotElement.innerHTML = task.slotCount;
        slotElement.style.margin = "auto auto";
        taskListElement.appendChild(slotElement);

        // Add the browse button
        const buttonElement = document.createElement('button');
        buttonElement.className = "btn btn-tp";
        buttonElement.style.marginTop = "-5px";
        buttonElement.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
        buttonElement.addEventListener('click', () => {
            // Navigate to the detail page
            window.location.href = `/pwa/progress/index.html?page=task-detail&taskId=${task.id}`;
        });
        taskListElement.appendChild(buttonElement);
    }

    if (tasks.length < 1) {
        const msgElement = document.createElement("p");
        msgElement.textContent = "There is no defined task."
        msgElement.style.textAlign = "center";
        const aElement = document.createElement("a");
        aElement.href = "/pwa/progress/index.html?page=task-add"
        aElement.textContent = "Create New Task"
        aElement.className = "btn btn-sm"
        aElement.style.maxWidth = "350px";
        aElement.style.margin = "0px auto";

        taskListElement.appendChild(msgElement);
        taskListElement.appendChild(aElement);
        taskListElement.style.display = "block";
    }
}

function renderAdditionalsTaskListPage() {
    const addTaskButton = document.createElement("a");
    addTaskButton.href = "/pwa/progress/index.html?page=task-add"
    addTaskButton.className = "btn btn-tp";
    addTaskButton.innerHTML = '<i class="fa-solid fa-plus"></i>';

    document.getElementById("nav-additions").appendChild(addTaskButton);

}


//////////////////////////////////////////////////////////////////////////
////////////////////////////// DETAILPAGE ////////////////////////////////
//////////////////////////////////////////////////////////////////////////
function renderAdditionalsDetailPage(taskId) {
    const addTaskButton = document.createElement("button");
    addTaskButton.className = "btn btn-tp";
    addTaskButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    addTaskButton.onclick = function () {
        const result = window.confirm("Do you really want to delete the task?");
        if (result) {
            clearTaskFromLocalStorage(taskId);
            window.location.href = "/pwa/progress/index.html?page=task-list"
        }
    }

    document.getElementById("nav-additions").appendChild(addTaskButton);
}

function renderCoinsById(dailySuccesArray) {
    const container = document.createElement('div');
    container.classList.add("coin-container");

    // Loop through the rows
    for (const element of dailySuccesArray) {
        // Create a circle div
        const circle = document.createElement('div');
        circle.classList.add("coin");

        circle.style.backgroundColor = {
            "-1": "gray",
            "0": "transparent",
            "1": "gold"
        }[element.succeed.toString()]

        // Append the circle div to the container div
        container.appendChild(circle);
    }

    // Append the canvas element to the body of the document
    document.getElementById("coins").appendChild(container);
}



function renderMetricListById(taskId, dailySuccessArray) {
    const taskDef = JSON.parse(localStorage.getItem(K_TASKDEFS) || "{}")[taskId];

    const metrics = {
        'Task Name': taskDef.name,
        'Start Date': taskDef.startDate,
        'Success Percentage': calculateSuccessRate(dailySuccessArray).toFixed(2) + '%',
        'Remaining Days': dailySuccessArray.reduce((ax, curr) => {
            if (curr.succeed === 0) {
                return ax + 1;
            }
            return ax;
        }, 0),
    }

    const metricGrid = document.createElement('div');
    metricGrid.classList.add('metric-grid');

    for (const [key, value] of Object.entries(metrics)) {
        const keyCell = document.createElement('div');
        keyCell.classList.add('metric-key');
        keyCell.textContent = `${key}:`;

        const valueCell = document.createElement('div');
        valueCell.classList.add('metric-value');
        valueCell.textContent = `${value}`;

        metricGrid.appendChild(keyCell);
        metricGrid.appendChild(valueCell);
    }

    document.getElementById("metrics").replaceChildren(metricGrid);
}


//////////////////////////////////////////////////////////////////////////
////////////////////////////// TASKASSIGN ////////////////////////////////
//////////////////////////////////////////////////////////////////////////


function renderTaskAssignById(taskList) {
    const urlParams = new URLSearchParams(window.location.search);
    const date = urlParams.get('targetDate');
    const time = urlParams.get('time');

    const dateElem = document.createElement('span');
    const timeElem = document.createElement('span');
    dateElem.textContent = date;
    timeElem.textContent = time;
    dateElem.style.fontWeight = 'bold';
    dateElem.style.marginRight = '10px';

    const dateTimeElem = document.createElement("div");
    dateTimeElem.classList.add("datetime-cont");
    dateTimeElem.appendChild(dateElem);
    dateTimeElem.appendChild(timeElem);


    const form = document.createElement('form'); // create form element
    form.classList.add("assign-form");
    const select = document.createElement('select'); // create select element
    const optionNone = document.createElement('option'); // create option element for "None"
    const addButton = document.createElement('button'); // create button element

    optionNone.value = ''; // set value of "None" option to empty string
    optionNone.textContent = 'None'; // set text of "None" option to "None"
    select.appendChild(optionNone); // add "None" option to select element

    taskList.forEach((task) => { // iterate over taskList to create options for each task
        const option = document.createElement('option'); // create option element
        option.value = task.id; // set value of option to task ID
        option.textContent = task.name; // set text of option to task name
        select.appendChild(option); // add option to select element
    });

    addButton.textContent = 'Add'; // set button text to Add
    addButton.type = "submit";
    addButton.classList.add("btn");
    addButton.style.marginTop = "50px";

    const selectLabel = document.createElement("label");
    selectLabel.textContent = "Select one of given tasks"

    form.appendChild(selectLabel);
    form.appendChild(select); // add select element to form
    form.appendChild(addButton); // add button element to form

    form.addEventListener("submit", event => {
        event.preventDefault();
        saveTaskLogToLocalStorage(date, time, select.value);
        window.location.href = `/pwa/progress/index.html?targetDate=${date}`
    });



    const contentElem = document.getElementById("assign");
    contentElem.replaceChildren(dateTimeElem);
    contentElem.appendChild(form); // add form element to document body
}

