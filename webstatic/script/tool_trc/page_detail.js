var targetName = null;


function renderDetailPage() {
    loadData();
    targetName = new URLSearchParams(window.location.search).get("target_name");
    addNavButtonToAdd();
}

function addNavButtonToAdd() {
    let element = document.createElement("span");
    element.innerText = "➕";
    element.classList.add("anav");
    element.onclick = () => {
        window.location.href = `/tool/trc/add?target_name=${targetName}`
    }
    document.getElementsByClassName("tool-nav")[0].appendChild(element);
}