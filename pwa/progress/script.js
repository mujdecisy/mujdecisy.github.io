//////////////////////////////////////////////////////////////////////////
//////////////////////////////// CALENDAR ////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function changeTargetDate(paramDate) {
    TARGET_DATE = paramDate;
    renderCalendarById(paramDate);
    renderCalendarHeaderById(paramDate);
}

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
            icon.className = "fa-solid fa-sun";
            //icon.className = "fa-solid fa-cloud-showers-heavy";

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
    prevMonthBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prevMonthBtn.addEventListener("click", () => {
        paramDate.setMonth(paramDate.getMonth() - 1);
        changeTargetDate(paramDate);
    });

    // Create the navigation button for the next month
    const nextMonthBtn = document.createElement("button");
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
        time.textContent = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

        // Add the time div element to the time slot div element
        timeContainer.appendChild(time);

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
      countsElem.textContent = `${task.doneCount}/${task.requiredCount}`;
  
      // Append the color, name, and counts elements to the task element.
      taskElem.appendChild(colorElem);
      taskElem.appendChild(nameElem);
      taskElem.appendChild(countsElem);
  
      // Append the task element to the container element.
      container.appendChild(taskElem);
    }
  
    // Get the sum of all doneCounts and requiredCounts in the task array.
    const doneCount = tasks.reduce((sum, task) => sum + task.doneCount, 0);
    const requiredCount = tasks.reduce((sum, task) => sum + task.requiredCount, 0);
  
    // Create a new div element for the task total and set its text content.
    const totalElem = document.createElement('div');
    totalElem.classList.add('task-total');
    totalElem.textContent = `Total: ${doneCount}/${requiredCount}`;
  
    // Append the total element to the container element.
    container.appendChild(totalElem);
  
    // Replace the child elements of the tasklist element with the container element.
    document.getElementById("tasklist").replaceChildren(container);
  }