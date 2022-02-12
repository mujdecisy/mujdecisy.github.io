function fillStorageKeys() {
    let elem = document.getElementById("storage-keys");
    elem.innerHTML = "";
    let keys = getStorageKeys();
    keys.forEach(e => {
        let opt = document.createElement("option");
        opt.innerHTML = e;
        opt.value = e;
        elem.appendChild(opt);
    });
}

function renderIOPage() {
    fillStorageKeys();
}

function loadStorageData() {
    let key = document.getElementById("storage-keys").value;
    let data = getFromStorage(key);
    
    let elem = document.getElementById("payload");
    elem.innerHTML = JSON.stringify(data);
}

function saveStorageData() {
    let key = document.getElementById("storage-keys").value;
    
    let elem = document.getElementById("payload");
    let data = JSON.parse(elem.innerHTML);

    persistToStorage(key, data);
}