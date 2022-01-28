var localStorage = window.localStorage;

var LS_TOOL_PNP_TASKS = "tool_pnp_tasks";
var LS_TOOL_PNP_ACTIONS = "tool_pnp_actions";

function mainInit () {
    let keys = [
        LS_TOOL_PNP_TASKS,
        LS_TOOL_PNP_ACTIONS
    ];

    keys.forEach(e => {
        if (localStorage.getItem(e) === null) {
            localStorage.setItem(e, JSON.stringify({}));
        }
    });
}

function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function persistToStorage(key, object) {
    localStorage.setItem(key, JSON.stringify(object));
}