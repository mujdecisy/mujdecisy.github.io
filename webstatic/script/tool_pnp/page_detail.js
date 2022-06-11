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

    strDates.forEach(date => {
        let done = 0;
        for (let timekey in actions[date]) {
            if (actions[date][timekey] === currentTaskName) {
                done++;
            }
        }
        history[date] = (done >= task.slot)? 1:0;
    });

    return history;   
}