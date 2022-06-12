function renderCreatePage() {
    loadData();
    clearTargetList();
    fillTargetList();
}

function addNewTarget() {
    let name = document.getElementById("name").value;
    let init = Number.parseFloat(document.getElementById("init").value);
    let target = Number.parseFloat(document.getElementById("target").value);

    let dateString = getDateAsString(new Date());

    targets[name] = {
        "name": name,
        "init": init,
        "target": target,
        "start": dateString
    };

    values[name] = {};
    values[name][dateString] = init;

    updateData();
    renderCreatePage();
}

function clearTargetList() {
    document.getElementsByClassName("item-list")[0].innerHTML = "";
}

function fillTargetList() {
    let targetList = document.getElementsByClassName("item-list")[0];
    for (let k in targets) {
        let element = document.createElement("div");
        element.innerText = `${k} : ${targets[k].init} >> ${targets[k].target}`;
        element.classList.add("item-element");
        element.onclick = () => {
            window.location.href = `/tool/trc/detail?target_name=${k}`
        }
        targetList.appendChild(element);
    }
}