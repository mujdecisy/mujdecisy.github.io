var targetName = null;


function renderAddPage() {
    loadData();
    targetName = new URLSearchParams(window.location.search).get("target_name");
    addNavButtonToDetail();
    clearValueList();
    fillValueList();
}

function addNavButtonToDetail() {
    document.getElementsByClassName("tool-nav")[0].innerHTML = "";
    
    let element = document.createElement("span");
    element.innerText = "⬅";
    element.classList.add("anav");
    element.onclick = () => {
        window.location.href = `/tool/trc/detail?target_name=${targetName}`
    }
    document.getElementsByClassName("tool-nav")[0].appendChild(element);
}

function saveValue() {
    let today = getDateAsString(new Date());
    let date = getDateAsString(new Date(document.getElementById("date").value));
    let value = Number.parseFloat(document.getElementById("value").value);

    if (date > today) {
        alert(`date can not be greater than today. (${today})`);
        return;
    }

    values[targetName][date] = value;
    updateData();
    renderAddPage();
}

function clearValueList() {
    document.getElementsByClassName("item-list")[0].innerHTML = "";
}

function fillValueList() {
    console.log(targetName);
    let itemList = document.getElementsByClassName("item-list")[0];
    let keys = Object.keys(values[targetName]);
    keys = keys.sort();

    for (let i=0; i< keys.length; i++) {
        k = keys[i];
        let element = document.createElement("div");
        element.innerText = `${k} > ${values[targetName][k]}`;
        element.classList.add("item-element");
        itemList.appendChild(element);
    }
}