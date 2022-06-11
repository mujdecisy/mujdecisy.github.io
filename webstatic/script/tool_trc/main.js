var targets = null;
var values = null;

function loadData() {
    targets = getFromStorage(LS_TOOL_TRC_TARGETS);
    values = getFromStorage(LS_TOOL_TRC_VALUES);
}

function updateData() {
    persistToStorage(LS_TOOL_TRC_TARGETS, targets);
    persistToStorage(LS_TOOL_TRC_VALUES, values);
}

