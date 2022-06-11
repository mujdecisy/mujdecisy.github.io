// ........................................................ PAGE - EDIT
function clearEditPage() {
    document.getElementsByClassName("item-list")[0].innerHTML = "";
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
    let tasksElement = document.getElementsByClassName("item-list")[0];

    for (let k in tasks) {
        let item = document.createElement("div");
        item.classList.add("item-element");
        item.innerHTML = tasks[k].name + " > " + tasks[k].days.join(",") + " > " + tasks[k].slot + " > " + tasks[k].start;
        item.style["background-color"] = tasks[k].color;
        item.onclick = () => {
            window.location.href = item.href = "/tool/pnp/detail?task_name=" + k;
        }
        tasksElement.appendChild(item);
    }
}