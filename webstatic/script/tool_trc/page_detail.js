var targetName = null;
var regressionPoints = null;
var minValue = null;
var dateStep = null;
var valueStep = null;
var dayCount = null;
var currentValue = null;

var h = 200;
var w = 300;


function renderDetailPage() {
    loadData();
    targetName = new URLSearchParams(window.location.search).get("target_name");
    addNavButtonToAdd();
    drawLineChart();
    renderStatistics();
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

function deleteTarget() {
    delete values[targetName];
    delete targets[targetName];
    window.location.href = "/tool/trc";
    updateData();
}

function functionToPoints(a,b,x1,x2) {
    let y1 = a*x1+b;
    let y2 = a*x2+b;
    return [[x1,y1], [x2,y2]];
}

function coordinatesToFunction(coordinates) {
    let x1 = coordinates[0][0];
    let y1 = coordinates[0][1];
    let x2 = coordinates[coordinates.length-1][0];
    let y2 = coordinates[coordinates.length-1][1];

    let a = (y2-y1)/(x2-x1);
    let b = y1 - a*x1;
    return [a,b];
}

function drawLineChart() {
    let data = values[targetName];
    let dates = Object.keys(data);
    dates.sort();

    let allDates = getStringDatesBetween(new Date(dates[0]), new Date());
    dayCount = allDates.length;
    dateStep = (w-10)/(allDates.length);

    //------------------------------------------ prepare values
    let allValues = [];
    minValue = Number.POSITIVE_INFINITY;
    let maxValue = Number.NEGATIVE_INFINITY;
    for (let i=0; i<allDates.length; i++) {
        if (allDates[i] in data) {
            allValues.push(data[allDates[i]]);
        } else{
            allValues.push(allValues[i-1]);
        }
        if (allValues[i] < minValue) {
            minValue = allValues[i];
        }
        if (allValues[i] > maxValue) {
            maxValue = allValues[i];
        }
        allDates[i] = i*dateStep + 5;
    }
    currentValue = allValues[allValues.length-1];
    valueStep = (h-10)/(maxValue-minValue);
    let coordinates = [];
    for (let i=0; i<allValues.length; i++) {
        allValues[i] = h - ((allValues[i]-minValue)*valueStep) - 5;
        coordinates.push([allDates[i], allValues[i]]);
    }

    //------------------------------------------ show values
    var c = document.getElementById("line-chart");
    var ctx = c.getContext("2d");
    
    ctx.beginPath();
    ctx.moveTo(coordinates[0][0], coordinates[0][1]);
    for (let i=1; i<coordinates.length; i++) {
        ctx.lineTo(coordinates[i][0], coordinates[i][1]);
    }
    ctx.strokeStyle = 'black';
    ctx.stroke();

    //------------------------------------------ prepare regression
    let result = regression.linear(coordinates);
    regressionPoints = functionToPoints(result.equation[0], result.equation[1], 5, w-5);

    //------------------------------------------ show regression
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(regressionPoints[0][0], regressionPoints[0][1]);
    ctx.lineTo(regressionPoints[1][0], regressionPoints[1][1]);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
}

function renderStatistics() {
    let crudTargetValue = targets[targetName].target;
    let targetValue = h-((crudTargetValue-minValue)*valueStep)-5;

    let coeffs = coordinatesToFunction(regressionPoints);
    let a = coeffs[0];
    let b = coeffs[1];
    let x = (targetValue-b)/a;

    document.getElementById("passed_day").innerText = dayCount;
    if (x < 5) {
        document.getElementById("remaining_day").innerText = "not possible";
    } else if (x < h-5) {
        document.getElementById("remaining_day").innerText = "congrats";
    } else {
        document.getElementById("remaining_day").innerText = Math.floor((x-h+5)/dateStep);
    }

    document.getElementById("target_value").innerHTML = crudTargetValue;
    document.getElementById("name").innerHTML = targetName;
    document.getElementById("init_val").innerHTML = targets[targetName].init;
    document.getElementById("current_val").innerHTML = currentValue;
    document.getElementById("start_date").innerHTML = targets[targetName].start;
}