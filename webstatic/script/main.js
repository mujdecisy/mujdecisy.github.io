var localStorage = window.localStorage;

var LS_TOOL_PNP_TASKS = "tool_pnp_tasks";
var LS_TOOL_PNP_ACTIONS = "tool_pnp_actions";
var LS_TOOL_TRC_TARGETS = "tool_trc_targets";
var LS_TOOL_TRC_VALUES = "tool_trc_values";

function mainInit () {
    let keys = [
        LS_TOOL_PNP_TASKS,
        LS_TOOL_PNP_ACTIONS,
        LS_TOOL_TRC_TARGETS,
        LS_TOOL_TRC_VALUES
    ];

    keys.forEach(e => {
        if (localStorage.getItem(e) === null) {
            localStorage.setItem(e, JSON.stringify({}));
        }
    });
}

function getStorageKeys() {
    return Object.keys(localStorage);
}

function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function persistToStorage(key, object) {
    localStorage.setItem(key, JSON.stringify(object));
}

function showModal(className) {
    let modals = document.getElementsByClassName(`modal ${className}`);
    modals[0].style["display"] = "block";
}

function closeModal() {
    let modals = document.getElementsByClassName("modal");
    for (let i=0; i<modals.length; i++) {
        modals[i].style["display"] = "none";
    }
}

function getDateAsString(date) {
    let localDateForISO = new Date(+date - date.getTimezoneOffset() * 60000);
    return localDateForISO.toISOString().substring(0, 10);
}