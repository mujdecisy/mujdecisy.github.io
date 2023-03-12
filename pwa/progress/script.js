//?///////////////////////////////////////////////////////////////////////
///////////////////////////////// UTILITY ////////////////////////////////
//////////////////////////////////////////////////////////////////////////
const PAD_NUM = 2;
const PAD_VAL = '0';
const LENMAX_TASKNAME = 20;
const LEN_SUCCEEDDAY = 35;
const CNT_SUCCEEDSTEP = 28;
const CNT_HALFHOURINADAY = 48;
const CNT_HALFHOURINMINS = 30;
const CNT_DAYSINWEEK = 7;
const CNT_HALFHOURINONEHOUR = 2;
const SIZE_WIDTHTSBLOCK = 52;
const PCT = 100;
const RATIO_NEG = 0.75;
const PATH = '/pwa/progress/index.html';
const KL_TASKDEFS = 'progress_taskDefs';
const KL_TASKLOGS = 'progress_taskLogs';
const KS_TARGETDATE = 'progress_targetDate';
const KS_TARGETTIME = 'progress_targetTime';
const KS_TARGETTASKID = 'progress_targetTaskId';

function dateToString(dateDate) {
    const year = dateDate.getFullYear();
    const month = (dateDate.getMonth() + 1).toString().padStart(PAD_NUM, PAD_VAL);
    const day = dateDate.getDate().toString().padStart(PAD_NUM, PAD_VAL);
    return `${year}-${month}-${day}`;
}

function changeTargetDate(paramDate) {
    sessionStorage.setItem(KS_TARGETDATE, dateToString(paramDate));
    window.location.href = PATH;
}

function checkNewTask(taskDict, taskName, taskColor) {
    if (taskName.length > LENMAX_TASKNAME) {
        throw new Error(`Task name can not be longer than ${LENMAX_TASKNAME} characters.`);
    }
    for (const taskId in taskDict) {
        if (taskDict.hasOwnProperty(taskId)) {
            const taskAttrs = taskDict[taskId];
            if (taskAttrs.name === taskName) {
                throw new Error('Name has already been obtained by another task.');
            }
            if (taskAttrs.color === taskColor) {
                throw new Error('Color has already been obtained by another task.');
            }
        }
    }
}

function jsonFromLocal(key, defaultValue = {}) {
    const value = localStorage.getItem(key);
    if (value) {
        return JSON.parse(value);
    }
    return defaultValue;
}

function jsonToLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


function saveTaskToLocalStorage(taskId, taskName, slotCount, daysOfWeek, startDate, color) {
    const taskDefinition = {
        id: taskId,
        name: taskName,
        slotCount,
        daysOfWeek,
        startDate,
        color
    };
    const taskDefs = jsonFromLocal(KL_TASKDEFS);
    checkNewTask(taskDefs, taskName, color);
    taskDefs[taskId] = taskDefinition;
    jsonToLocal(KL_TASKDEFS, taskDefs);
}

function saveTaskLogToLocalStorage(date, time, taskId) {
    const taskLogs = jsonFromLocal(KL_TASKLOGS);
    if (taskId === '') {
        if (taskLogs[date] && taskLogs[date][time]) {
            delete taskLogs[date][time];
        }
    } else {
        if (!taskLogs[date]) {
            taskLogs[date] = {};
        }
        if (!taskLogs[date][time]) {
            taskLogs[date][time] = 0;
        }
        taskLogs[date][time] = parseInt(taskId);
    }
    jsonToLocal(KL_TASKLOGS, taskLogs);
}

function getTaskDefs(dayOfWeek = null, targetDate = null) {
    const taskDefs = jsonFromLocal(KL_TASKDEFS);
    const taskList = [];
    for (const taskId in taskDefs) {
        if (
            (targetDate == null || taskDefs[taskId].startDate <= dateToString(targetDate))
            &&
            (dayOfWeek === null || taskDefs[taskId].daysOfWeek.includes(dayOfWeek))
        ) {
            taskList.push(taskDefs[taskId]);
            taskDefs[taskId].color = `var(--${taskDefs[taskId].color})`;
        }
    }
    return taskList;
}

function getDailyTasksWithDoneCounts(taskDefs, taskLogs) {
    const doneCounts = {};
    taskDefs.forEach(e => {
        doneCounts[e.id] = 0;
    });
    for (const time in taskLogs) {
        doneCounts[taskLogs[time]] += 1;
    }
    taskDefs.forEach(e => {
        e.doneCount = doneCounts[e.id];
    });
    return taskDefs;
}

function getDailySuccessOfTask(taskId) {
    const taskDefs = jsonFromLocal(KL_TASKDEFS)[taskId];
    const taskLogs = jsonFromLocal(KL_TASKLOGS);
    const datePivot = new Date(taskDefs.startDate);
    const successArray = [];
    const today = dateToString(new Date());
    while (successArray.length < LEN_SUCCEEDDAY) {
        if (taskDefs.daysOfWeek.includes(datePivot.getDay().toString())) {
            const dateString = dateToString(datePivot);
            let succeed = 0, doneCount = 0;
            if (dateString <= today) {
                if (dateString in taskLogs) {
                    const timeKeys = Object.keys(taskLogs[dateString]);
                    doneCount = timeKeys.reduce((ax, curr) =>
                        (taskLogs[dateString][curr] === taskId) ? ax + 1 : ax
                        , 0);
                }
                succeed = (doneCount >= taskDefs.slotCount) ? 1 : -1;
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
    const stepSize = PCT / CNT_SUCCEEDSTEP;
    let point = 0;
    for (const dailySuccess of dailySuccessArray) {
        if (dailySuccess.succeed === 1) {
            point += stepSize;
        } else if (dailySuccess.succeed === -1) {
            point -= stepSize * RATIO_NEG;
        } else {
            break;
        }
    }
    return Math.min(Math.max(point, 0), PCT);
}

function clearTaskFromLocalStorage(taskId) {
    const taskLogs = jsonFromLocal(KL_TASKLOGS);
    for (const date in taskLogs) {
        for (const time in taskLogs[date]) {
            if (taskLogs[date][time] === taskId) {
                delete taskLogs[date][time];
            }
        }
    }
    jsonToLocal(KL_TASKLOGS, taskLogs);
    const taskDefs = jsonFromLocal(KL_TASKDEFS);
    delete taskDefs[taskId];
    jsonToLocal(KL_TASKDEFS, taskDefs);
}

function createAnchor(link, innerHTML) {
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.innerHTML = innerHTML;
    return anchor;
}

function createConductToPage(message, buttonLabel, link) {
    const container = document.createElement('div');

    const msgElement = document.createElement('p');
    msgElement.textContent = message;
    msgElement.style.textAlign = 'center';
    const aElement = createAnchor(link, buttonLabel);
    aElement.className = 'btn btn-tp btn-ul';
    aElement.style.maxWidth = '350px';
    aElement.style.margin = '0px auto';

    container.appendChild(msgElement);
    container.appendChild(aElement);

    return container;
}

//?///////////////////////////////////////////////////////////////////////
////////////////////////////////// PAGES /////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function renderPageDashBoard(content, date) {
    const taskLogs = jsonFromLocal(KL_TASKLOGS)[dateToString(date)] || {};
    const taskDefs = getTaskDefs(date.getDay().toString(), date);
    content.innerHTML = `
                    <div id="calendar-header"></div>
                    <div id="calendar"></div>
                    <div id="timeslot"></div>
                    <div id="dailytasks"></div>
                `;
    renderAdditionalsDashboardPage();
    renderCalendarHeaderById(date);
    renderCalendarById(date);
    renderTimeslotById(taskDefs, taskLogs, date);
    renderDailyTasksById(getDailyTasksWithDoneCounts(taskDefs, taskLogs));
}

function renderPageTaskAdd(content) {
    content.innerHTML = `
        <div id="taskaddform"></div>
    `;
    renderTaskFormById();
}

function renderPageTaskList(content) {
    content.innerHTML = `
        <div id="tasklistp"></div>
    `;
    renderTaskListPageById(getTaskDefs());
    renderAdditionalsTaskListPage();
}

function renderPageTaskDetail(content, taskId) {
    content.innerHTML = `
        <div id="coins"></div>
        <div id="metrics"></div>
    `;
    const dailySuccesArray = getDailySuccessOfTask(taskId);
    renderAdditionalsDetailPage(taskId);
    renderCoinsById(dailySuccesArray);
    renderMetricListById(taskId, dailySuccesArray);
}

function renderPageAssignment(content, date, time) {
    const taskDefs = getTaskDefs(date.getDay().toString(), date);
    content.innerHTML = `
        <div id="assign"></div>
    `;
    renderTaskAssignById(taskDefs, date, time);
}

function renderPageIo(content) {
    content.innerHTML = `
        <div id="data-json" />
    `;
    renderAdditionalsIoPage();
    renderIoTextById();
}


//?///////////////////////////////////////////////////////////////////////
////////////////////////////// NAVIGATION ////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function renderNavigationBarById() {
    const navigationBar = document.createElement('nav');

    const appName = createAnchor(PATH, 'Progress.');
    appName.style.borderBottom = '5px solid gold';
    appName.className = 'no-deco nav-header';

    const additionals = document.createElement('div');
    additionals.id = 'nav-additions';

    navigationBar.appendChild(appName);
    navigationBar.appendChild(additionals);

    document.getElementById('navigation').replaceChildren(navigationBar);
}

//?///////////////////////////////////////////////////////////////////////
//////////////////////////////// INDEXPAG ////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function renderAdditionalsDashboardPage() {
    const navAdds = document.getElementById('nav-additions');
    const ioButton = createAnchor(`${PATH}?page=io`, '<i class="fa-regular fa-floppy-disk"></i>');
    ioButton.className = 'btn btn-tp';
    navAdds.appendChild(ioButton);
    const todayButton = document.createElement('button');
    todayButton.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i>';
    todayButton.className = 'btn btn-tp';
    todayButton.onclick = function () {
        sessionStorage.setItem(KS_TARGETDATE, dateToString(new Date()));
        window.location.href = PATH;
    };
    navAdds.appendChild(todayButton);
    const allTasksButton = createAnchor(
        `${PATH}?page=task-list`,
        '<i class="fa-solid fa-list-check"></i>'
    );
    allTasksButton.className = 'btn btn-tp';
    navAdds.appendChild(allTasksButton);
}

//?///////////////////////////////////////////////////////////////////////
//////////////////////////////// CALENDAR ////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function getCalendarDates(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysFromPrevMonth = (firstDayOfWeek + CNT_DAYSINWEEK - 1) % CNT_DAYSINWEEK;
    const daysFromNextMonth = CNT_DAYSINWEEK - ((daysFromPrevMonth + daysInMonth) % CNT_DAYSINWEEK);
    const calendarDates = [];
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
        calendarDates.push(new Date(year, month, -i));
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDates.push(new Date(year, month, i));
    }
    for (let i = 1; i <= daysFromNextMonth; i++) {
        calendarDates.push(new Date(year, month + 1, i));
    }
    const weeks = [];
    for (let i = 0; i < calendarDates.length; i += 7) {
        weeks.push(calendarDates.slice(i, i + 7));
    }
    return weeks;
}

function renderCalendarById(paramDate) {
    const datesArray = getCalendarDates(paramDate);
    const numRows = datesArray.length;
    const numCols = datesArray[0].length;
    const table = document.createElement('table');
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const headerRow = document.createElement('tr');
    for (const element of daysOfWeek) {
        const headerCell = document.createElement('th');
        headerCell.textContent = element;
        headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);
    const today = new Date();
    for (let i = 0; i < numRows; i++) {
        const week = datesArray[i];
        const row = document.createElement('tr');
        for (let j = 0; j < numCols; j++) {
            const date = week[j];
            const cell = document.createElement('td');
            const cellBox = document.createElement('div');
            cellBox.style.display = 'flex';
            cellBox.style.justifyContent = 'space-between';
            cellBox.style.width = '100%';
            const dateString = document.createElement('span');
            dateString.textContent = date.getDate();
            const icon = document.createElement('i');
            const tasks = getDailyTasksWithDoneCounts(
                getTaskDefs(date.getDay().toString(), date),
                jsonFromLocal(KL_TASKLOGS)[dateToString(date)]
            );
            let allDone = true;
            for (const task of tasks) {
                if (task.doneCount < task.slotCount) {
                    allDone = false;
                    break;
                }
            }
            if (tasks.length > 0 && dateToString(date) <= dateToString(today)) {
                icon.className = (allDone) ? 'fa-solid fa-sun' : 'fa-solid fa-cloud-showers-heavy';
            }
            cellBox.appendChild(dateString);
            cellBox.appendChild(icon);
            cell.appendChild(cellBox);
            if (date.toDateString() === paramDate.toDateString()) {
                cell.classList.add('cal-in-day');
            }
            if (date.getMonth() === paramDate.getMonth()) {
                cell.classList.add('cal-in-month');
                cell.onclick = function () {
                    changeTargetDate(date);
                };
            }
            cell.classList.add('cal-item');
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    table.classList.add('cal-table');
    const calendar = document.getElementById('calendar');
    calendar.replaceChildren(table);
}

function renderCalendarHeaderById(paramDate) {

    const header = document.createElement('div');
    header.classList.add('cal-header');


    const prevMonthBtn = document.createElement('button');
    prevMonthBtn.className = 'btn btn-sm';
    prevMonthBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prevMonthBtn.addEventListener('click', () => {
        paramDate.setMonth(paramDate.getMonth() - 1);
        changeTargetDate(paramDate);
    });


    const nextMonthBtn = document.createElement('button');
    nextMonthBtn.className = 'btn btn-sm';
    nextMonthBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    nextMonthBtn.addEventListener('click', () => {
        paramDate.setMonth(paramDate.getMonth() + 1);
        changeTargetDate(paramDate);
    });
    const monthYearText = document.createElement('div');
    monthYearText.textContent = `${paramDate.toLocaleString('default', { month: 'long' })} ${paramDate.getFullYear()}`;
    monthYearText.style.textAlign = 'center';
    monthYearText.style.fontWeight = 'bold';
    header.appendChild(prevMonthBtn);
    header.appendChild(monthYearText);
    header.appendChild(nextMonthBtn);
    document.getElementById('calendar-header').replaceChildren(header);
}


//?///////////////////////////////////////////////////////////////////////
//////////////////////////////// TIMESLOT ////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function halfHourCountdown() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return hours * CNT_HALFHOURINONEHOUR + ((minutes > CNT_HALFHOURINMINS) ? 1 : 0);
}

function renderTimeslotById(taskDefs, taskLogs, date) {
    const container = document.createElement('div');
    container.classList.add('slot-cont');
    for (let i = 0; i < CNT_HALFHOURINADAY; i++) {
        const hour = Math.floor(i / PAD_NUM);
        const minute = (i % PAD_NUM) * CNT_HALFHOURINMINS;
        const timeContainer = document.createElement('div');
        timeContainer.classList.add('slot-item');
        const time = document.createElement('div');
        const timeStr = `${hour.toString().padStart(PAD_NUM, PAD_VAL)}:${minute.toString().padStart(PAD_NUM, PAD_VAL)}`;
        time.textContent = timeStr;
        if (timeStr in taskLogs) {
            for (const el of taskDefs) {
                if (el.id === taskLogs[timeStr]) {
                    timeContainer.style.backgroundColor = el.color;
                    break;
                }
            }
        }
        timeContainer.appendChild(time);
        timeContainer.onclick = function () {
            sessionStorage.setItem(KS_TARGETDATE, dateToString(date));
            sessionStorage.setItem(KS_TARGETTIME, timeStr);
            window.location.href = `${PATH}?page=assignment`;
        };
        container.appendChild(timeContainer);
    }
    const timeSlotElement = document.getElementById('timeslot');
    timeSlotElement.replaceChildren(container);
    const nthHalfHour = halfHourCountdown();
    timeSlotElement.scrollBy({
        left: nthHalfHour * SIZE_WIDTHTSBLOCK,
        behavior: 'smooth'
    });
}


//?///////////////////////////////////////////////////////////////////////
//////////////////////////////// DAILYTASKS //////////////////////////////
//////////////////////////////////////////////////////////////////////////


function renderDailyTasksById(tasks) {
    const container = document.createElement('div');
    container.style.marginTop = '20px';
    for (const task of tasks) {
        const taskElem = document.createElement('div');
        taskElem.classList.add('task');
        const colorElem = document.createElement('div');
        colorElem.classList.add('task-color');
        colorElem.style.setProperty('--task-color', task.color);
        const nameElem = document.createElement('div');
        nameElem.classList.add('task-name');
        nameElem.textContent = task.name;
        const countsElem = document.createElement('div');
        countsElem.classList.add('task-counts');
        countsElem.textContent = `${task.doneCount}/${task.slotCount}`;
        taskElem.appendChild(colorElem);
        taskElem.appendChild(nameElem);
        taskElem.appendChild(countsElem);
        container.appendChild(taskElem);
    }
    if (tasks.length > 0) {
        const doneCount = tasks.reduce((sum, task) => sum + task.doneCount, 0);
        const requiredCount = tasks.reduce((sum, task) => sum + task.slotCount, 0);
        const totalElem = document.createElement('div');
        totalElem.classList.add('task-total');
        totalElem.textContent = `Total: ${doneCount}/${requiredCount}`;
        container.appendChild(totalElem);
    } else {
        container.appendChild(
            createConductToPage(
                'There is no task to do for today.',
                'Create New Task',
                `${PATH}?page=task-add`
            )
        );
    }
    document.getElementById('dailytasks').replaceChildren(container);
}

//?///////////////////////////////////////////////////////////////////////
///////////////////////////// TASKADDFORM ////////////////////////////////
//////////////////////////////////////////////////////////////////////////


function renderTaskFormById() {
    const form = document.createElement('form');
    form.classList.add('task-form');
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Task Name';
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('placeholder', 'Enter task name');
    nameInput.setAttribute('required', true);
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    const daysLabel = document.createElement('label');
    daysLabel.textContent = 'Days to do in a week';
    const daysInput = document.createElement('select');
    daysInput.setAttribute('multiple', true);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let counter = 1;
    for (const day of days) {
        const option = document.createElement('option');
        option.setAttribute('value', counter);
        counter = (counter + 1) % CNT_DAYSINWEEK;
        option.textContent = day;
        daysInput.appendChild(option);
    }
    form.appendChild(daysLabel);
    form.appendChild(daysInput);
    const startDateLabel = document.createElement('label');
    startDateLabel.textContent = 'Start At';
    const startDateInput = document.createElement('input');
    startDateInput.setAttribute('type', 'date');
    startDateInput.setAttribute('required', true);
    form.appendChild(startDateLabel);
    form.appendChild(startDateInput);
    const slotsLabel = document.createElement('label');
    slotsLabel.textContent = 'Slots to do daily';
    const slotsInput = document.createElement('input');
    slotsInput.setAttribute('type', 'number');
    slotsInput.setAttribute('min', 1);
    slotsInput.setAttribute('max', 24);
    slotsInput.setAttribute('placeholder', '1 slot = 30 min a day');
    slotsInput.setAttribute('required', true);
    form.appendChild(slotsLabel);
    form.appendChild(slotsInput);
    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Color';
    const colorInput = document.createElement('select');
    const colors = ['red', 'blue', 'yellow', 'green', 'pink'];
    for (const color of colors) {
        const option = document.createElement('option');
        option.setAttribute('value', color);
        option.innerText = color.toUpperCase();
        option.style.backgroundColor = color;
        colorInput.appendChild(option);
    }
    form.appendChild(colorLabel);
    form.appendChild(colorInput);
    const submitButton = document.createElement('button');
    submitButton.style.marginTop = '30px';
    submitButton.classList.add('btn');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Create Task';
    form.appendChild(submitButton);
    form.addEventListener('submit', event => {
        event.preventDefault();
        const selectedValues = Array.from(daysInput.selectedOptions, option => option.value.toString());
        const date = new Date();
        try {
            saveTaskToLocalStorage(
                parseInt(date.getTime()),
                nameInput.value.toUpperCase(),
                parseInt(slotsInput.value),
                selectedValues.join(''),
                startDateInput.value,
                colorInput.value
            );
            window.location.href = PATH;
        } catch (error) {
            alert(error);
        }
    });
    document.getElementById('taskaddform').replaceChildren(form);
}


//?///////////////////////////////////////////////////////////////////////
//////////////////////////// TASKLISTPAGE ////////////////////////////////
//////////////////////////////////////////////////////////////////////////
function getDaysOfWeek(activeDays) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysOfWeekElement = document.createElement('div');
    daysOfWeekElement.classList.add('days-of-week');
    for (let i = 1; i < daysOfWeek.length + 1; i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = daysOfWeek[i % CNT_DAYSINWEEK].charAt(0);
        if (activeDays.includes((i % CNT_DAYSINWEEK).toString())) {
            dayElement.style.color = 'black';
            dayElement.style.fontWeight = 'bolder';
            dayElement.style.textDecoration = 'underline';
        } else {
            dayElement.style.color = 'gray';
            dayElement.style.fontWeight = 'lighter';
        }
        daysOfWeekElement.appendChild(dayElement);
    }
    return daysOfWeekElement;
}


function renderTaskListPageById(tasks) {
    const taskListElement = document.getElementById('tasklistp');
    for (let task of tasks) {
        const colorBulletElement = document.createElement('div');
        colorBulletElement.classList.add('task-color');
        colorBulletElement.style.setProperty('--task-color', task.color);
        taskListElement.appendChild(colorBulletElement);
        const nameElement = document.createElement('div');
        nameElement.textContent = task.name;
        nameElement.style.textOverflow = 'ellipsis';
        taskListElement.appendChild(nameElement);
        taskListElement.appendChild(getDaysOfWeek(task.daysOfWeek));
        const slotElement = document.createElement('div');
        slotElement.innerHTML = task.slotCount;
        slotElement.style.margin = 'auto auto';
        taskListElement.appendChild(slotElement);
        const buttonElement = document.createElement('button');
        buttonElement.className = 'btn btn-tp';
        buttonElement.style.marginTop = '-5px';
        buttonElement.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
        buttonElement.addEventListener('click', () => {
            sessionStorage.setItem(KS_TARGETTASKID, task.id);
            window.location.href = `${PATH}?page=task-detail`;
        });
        taskListElement.appendChild(buttonElement);
    }
    if (tasks.length < 1) {
        taskListElement.appendChild(
            createConductToPage(
                'There is no defined task.',
                'Create New Task',
                `${PATH}?page=task-add`
            )
        );
        taskListElement.style.display = 'block';
    }
}

function renderAdditionalsTaskListPage() {
    const addTaskButton = createAnchor(`${PATH}?page=task-add`, '<i class="fa-solid fa-plus"></i>');
    addTaskButton.className = 'btn btn-tp';
    document.getElementById('nav-additions').appendChild(addTaskButton);
}


//?///////////////////////////////////////////////////////////////////////
////////////////////////////// DETAILPAGE ////////////////////////////////
//////////////////////////////////////////////////////////////////////////
function renderAdditionalsDetailPage(taskId) {
    const addTaskButton = document.createElement('button');
    addTaskButton.className = 'btn btn-tp';
    addTaskButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    addTaskButton.onclick = function () {
        const result = confirm('Do you really want to delete the task?');
        if (result) {
            clearTaskFromLocalStorage(taskId);
            window.location.href = `${PATH}?page=task-list`;
        }
    };
    document.getElementById('nav-additions').appendChild(addTaskButton);
}

function renderCoinsById(dailySuccesArray) {
    const container = document.createElement('div');
    container.classList.add('coin-container');
    for (const element of dailySuccesArray) {
        const circle = document.createElement('div');
        circle.classList.add('coin');
        circle.style.backgroundColor = {
            '-1': 'gray',
            '0': 'transparent',
            '1': 'gold'
        }[element.succeed.toString()];
        container.appendChild(circle);
    }
    document.getElementById('coins').appendChild(container);
}

function renderMetricListById(taskId, dailySuccessArray) {
    const taskDef = jsonFromLocal(KL_TASKDEFS)[taskId];
    const metrics = {
        'Task Name': taskDef.name,
        'Start Date': taskDef.startDate,
        'Success Percentage': calculateSuccessRate(dailySuccessArray).toFixed(PAD_NUM) + '%',
        'Remaining Days': dailySuccessArray.reduce((ax, curr) => {
            if (curr.succeed === 0) {
                return ax + 1;
            }
            return ax;
        }, 0)
    };
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
    document.getElementById('metrics').replaceChildren(metricGrid);
}


//?///////////////////////////////////////////////////////////////////////
////////////////////////////// TASKASSIGN ////////////////////////////////
//////////////////////////////////////////////////////////////////////////


function renderTaskAssignById(taskList, date, time) {
    const dateElem = document.createElement('span');
    const timeElem = document.createElement('span');
    dateElem.textContent = dateToString(date);
    timeElem.textContent = time;
    dateElem.style.fontWeight = 'bold';
    dateElem.style.marginRight = '10px';
    const dateTimeElem = document.createElement('div');
    dateTimeElem.classList.add('datetime-cont');
    dateTimeElem.appendChild(dateElem);
    dateTimeElem.appendChild(timeElem);
    const form = document.createElement('form');
    form.classList.add('assign-form');
    const select = document.createElement('select');
    const optionNone = document.createElement('option');
    const addButton = document.createElement('button');
    optionNone.value = '';
    optionNone.textContent = 'None';
    select.appendChild(optionNone);
    taskList.forEach(task => {
        const option = document.createElement('option');
        option.value = task.id;
        option.textContent = task.name;
        select.appendChild(option);
    });
    addButton.textContent = 'Add';
    addButton.type = 'submit';
    addButton.classList.add('btn');
    addButton.style.marginTop = '50px';
    const selectLabel = document.createElement('label');
    selectLabel.textContent = 'Select one of given tasks';
    form.appendChild(selectLabel);
    form.appendChild(select);
    form.appendChild(addButton);
    form.addEventListener('submit', event => {
        event.preventDefault();
        saveTaskLogToLocalStorage(dateToString(date), time, select.value);
        window.location.href = PATH;
    });
    const contentElem = document.getElementById('assign');
    contentElem.replaceChildren(dateTimeElem);
    contentElem.appendChild(form);
}

//?///////////////////////////////////////////////////////////////////////
////////////////////////////// INPUTOUTPUT ///////////////////////////////
//////////////////////////////////////////////////////////////////////////
function renderAdditionalsIoPage() {
    const navAdds = document.getElementById('nav-additions');
    const copyButton = document.createElement('button');
    copyButton.innerHTML = '<i class="fa-solid fa-copy"></i>';
    copyButton.className = 'btn btn-tp';
    copyButton.addEventListener('click', () => {
        document.getElementById('data-json').getElementsByTagName('textarea')[0].select();
        document.execCommand('copy');
    });
    navAdds.appendChild(copyButton);
}


function renderIoTextById() {
    const dataJsonInit = {
        [KL_TASKDEFS] : jsonFromLocal(KL_TASKDEFS),
        [KL_TASKLOGS] : jsonFromLocal(KL_TASKLOGS)
    };

    const textArea = document.createElement('textarea');
    textArea.rows = '10';
    textArea.style.width = '98%';
    textArea.value = JSON.stringify(dataJsonInit, undefined, 2);

    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.className = 'btn btn-sm';
    saveButton.style.margin = '20px auto';
    saveButton.style.width = '60%';
    saveButton.addEventListener('click', () => {
        const dataJson = JSON.parse(textArea.value);
        jsonToLocal(KL_TASKDEFS, dataJson[KL_TASKDEFS]);
        jsonToLocal(KL_TASKLOGS, dataJson[KL_TASKLOGS]);
        window.location.href = `${PATH}?page=io`;
    });

    const container = document.getElementById('data-json');
    container.appendChild(textArea);
    container.appendChild(saveButton);
}
