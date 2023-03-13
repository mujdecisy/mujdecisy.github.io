//?///////////////////////////////////////////////////////////////////////
///////////////////////////////// UTIL ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////
const PATH = '/pwa/improve/index.html';
const KL_TOPIC = 'improve_topic';
const KS_TARGETTOPICID = 'improve_targetTopicId';
const CNT_MILLISINDAY = 24 * 60 * 60 * 1000;

function saveTopic(topicName, startDate, initVal, targetVal) {
    const topicId = (new Date()).getTime();
    const startDateStr = dateToString(startDate);
    const topic = {
        id: topicId,
        name: topicName,
        startDate: startDateStr,
        initVal,
        targetVal,
        iters: {
            [startDateStr]: initVal
        }
    }
    const topicDefs = jsonFromLocal(KL_TOPIC);
    // control
    for(const key in topicDefs) {
        if (topicDefs[key].name === topicName) {
            throw Error('There is already a topic with same name.');
        }
    }
    if (new Date() < startDate) {
        throw Error('Start Date can not be a date after today.');
    }

    topicDefs[topicId] = topic;
    jsonToLocal(KL_TOPIC, topicDefs);
}

function saveIter(topicId, date, val) {
    const topicDefs = jsonFromLocal(KL_TOPIC);
    
    // control
    if (new Date() < date) {
        throw Error('Date can not be a date after today.');
    }
    if (dateToString(date) < topicDefs[topicId].startDate) {
        throw Error('Date can not be a date before start date.');
    }

    if (val === null) {
        delete topicDefs[topicId].iters[dateToString(date)]
    } else {
        topicDefs[topicId].iters[dateToString(date)] = val;
    }
    jsonToLocal(KL_TOPIC, topicDefs);
}

function prepareIters(timeSeriesDict) {
    // Convert the date strings to Date objects and sort the entries by date
    const entries = Object.entries(timeSeriesDict)
        .map(([dateString, value]) => [new Date(dateString), value])
        .sort(([a], [b]) => a - b);

    const interval = CNT_MILLISINDAY;

    // Interpolate the values at evenly spaced times
    const interpolatedEntries = [];
    for (let i = 0; i < entries.length - 1; i++) {
        const [startDate, startValue] = entries[i];
        const [endDate, endValue] = entries[i + 1];
        const start = startDate.getTime();
        const end = endDate.getTime();
        for (let t = start; t < end; t += interval) {
            const value = startValue + (endValue - startValue) * (t - start) / (end - start);
            interpolatedEntries.push([new Date(t), value]);
        }
    }
    interpolatedEntries.push(entries[entries.length - 1]);

    const todayStr = dateToString(new Date());
    while(dateToString(interpolatedEntries[interpolatedEntries.length-1][0]) < todayStr) {
        const dayNext = new Date(interpolatedEntries[interpolatedEntries.length-1][0].getTime() + CNT_MILLISINDAY);
        interpolatedEntries.push([dayNext,  entries[entries.length - 1][1]]);
    }


    const dates = interpolatedEntries.map(e => dateToString(e[0]));
    const values = interpolatedEntries.map(e => e[1]);

    // Calculate regresssion with regression.js
    const regfn = regression.linear(values.map((e, ix) => [ix, e]));
    const regress = values.map((_, ix) => regfn.predict(ix)[1]);

    return [dates, values, regress, regfn.equation];
}

//?///////////////////////////////////////////////////////////////////////
//////////////////////////////// PAGES ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function renderPageDashboard(content) {
    content.innerHTML = `
        <div id="topic-list"></div>
    `;
    renderNavAddsDashboardPage();
    renderTopicListById('topic-list');
}

function renderPageTopicAdd(content) {
    content.innerHTML = `
        <div id="topic-add-form"></div>
    `;
    renderFormTaskAddById('topic-add-form');
}

function renderPageTopicDetail(content) {
    content.innerHTML = `
        <div id="topic-chart"></div>
        <div id="topic-metrics"></div>
    `;

    const topicId = sessionStorage.getItem(KS_TARGETTOPICID);
    const topic = jsonFromLocal(KL_TOPIC)[topicId];
    const [dates, vals, regress, eq] = prepareIters(topic.iters);

    renderNavAddsTopicDetailPage();
    renderTopicChartById('topic-chart', dates, vals, regress);
    renderTopicMetricsById('topic-metrics', topic, dates, eq);

}

function renderPageIteration(content) {
    content.innerHTML = `
        <div id="iter-info"></div>
        <div id="iter-form"></div>
    `;

    const topicId = sessionStorage.getItem(KS_TARGETTOPICID);
    const topicDef = jsonFromLocal(KL_TOPIC)[topicId];

    renderIterInfoById('iter-info', topicDef);
    renderIterFormById('iter-form', topicDef);
}

function renderPageIo(content) {
    content.innerHTML = `
        <div id="data-json" />
    `;
    renderAdditionalsIoPage();
    renderIoTextById([KL_TOPIC]);
}

//?///////////////////////////////////////////////////////////////////////
//////////////////////////// DASHBOARD ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function renderNavAddsDashboardPage() {
    const navAdds = document.getElementById(ID_NAVADDS);

    const ioButton = createAnchor(`${PATH}?page=io`, '<i class="fa-regular fa-floppy-disk"></i>');
    ioButton.className = 'btn btn-tp';
    navAdds.appendChild(ioButton);

    const createButton = createAnchor(
        `${PATH}?page=topic-add`,
        '<i class="fa-solid fa-plus"></i>'
    );
    createButton.className = 'btn btn-tp';

    navAdds.appendChild(createButton);
}

function renderTopicListById(elId) {
    const container = document.createElement('div');
    container.classList.add('topic-list-container');

    const topicDefs = jsonFromLocal(KL_TOPIC);
    Object.keys(topicDefs).forEach(key => {
        const e = topicDefs[key];
        const name = document.createElement('label');
        name.innerText = e.name;
        container.appendChild(name);
        const initVal = document.createElement('span');
        initVal.innerText = e.initVal;
        container.appendChild(initVal);
        const arrow = document.createElement('span');
        arrow.innerHTML = '<i class="fa-solid fa-angles-right"></i>';
        arrow.style.backgroundColor = 'lemonchiffon';
        arrow.style.borderRadius = '10px';
        arrow.style.padding = '5px 10px';
        container.appendChild(arrow);
        const targetVal = document.createElement('span');
        targetVal.innerText = e.targetVal;
        container.appendChild(targetVal);
        const detailButton = document.createElement('button');
        detailButton.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
        detailButton.className = 'btn btn-sm';
        detailButton.onclick = function () {
            sessionStorage.setItem(KS_TARGETTOPICID, e.id);
            window.location.href = `${PATH}?page=topic-detail`;
        };
        container.appendChild(detailButton);
    });

    if (Object.keys(topicDefs).length < 1) {
        const conductPage = createConductToPage(
            'There is no topic.',
            'Create A New Topic',
            `${PATH}?page=topic-add`
        );
        container.appendChild(conductPage);
        container.style.display = 'block';
    }

    document.getElementById(elId).appendChild(container);
}

//?///////////////////////////////////////////////////////////////////////
///////////////////////////// TOPIC-ADD //////////////////////////////////
//////////////////////////////////////////////////////////////////////////
function renderFormTaskAddById(elId) {
    const form = document.createElement('form');
    form.classList.add('form-cont');
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Topic Name';
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('placeholder', 'Enter task name');
    nameInput.setAttribute('required', true);
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    const startDateLabel = document.createElement('label');
    startDateLabel.textContent = 'Start At';
    const startDateInput = document.createElement('input');
    startDateInput.setAttribute('type', 'date');
    startDateInput.setAttribute('required', true);
    form.appendChild(startDateLabel);
    form.appendChild(startDateInput);
    const initVaLabel = document.createElement('label');
    initVaLabel.textContent = 'Initial Value';
    const initVaInput = document.createElement('input');
    initVaInput.setAttribute('type', 'number');
    initVaInput.setAttribute('step', '0.01');
    initVaInput.setAttribute('required', true);
    form.appendChild(initVaLabel);
    form.appendChild(initVaInput);
    const targetVaLabel = document.createElement('label');
    targetVaLabel.textContent = 'Target Value';
    const targetVaInput = document.createElement('input');
    targetVaInput.setAttribute('type', 'number');
    targetVaInput.setAttribute('step', '0.01');
    targetVaInput.setAttribute('required', true);
    form.appendChild(targetVaLabel);
    form.appendChild(targetVaInput);
    const submitButton = document.createElement('button');
    submitButton.style.marginTop = '30px';
    submitButton.classList.add('btn');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Create Topic';
    form.appendChild(submitButton);
    form.addEventListener('submit', event => {
        event.preventDefault();
        try {
            saveTopic(
                nameInput.value.toUpperCase(),
                new Date(startDateInput.value),
                parseFloat(initVaInput.value),
                parseFloat(targetVaInput.value)
            );
            window.location.href = PATH;
        } catch (error) {
            alert(error);
        }
    });
    document.getElementById(elId).replaceChildren(form);
}


//?///////////////////////////////////////////////////////////////////////
/////////////////////////// TOPIC-DETAIL /////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function renderNavAddsTopicDetailPage() {
    const navAdds = document.getElementById(ID_NAVADDS);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteButton.className = 'btn btn-tp';
    deleteButton.onclick = function() {
        const result = confirm('Do you really want to delete this topic?');
        if (result) {
            const topicId = sessionStorage.getItem(KS_TARGETTOPICID);
            const topics = jsonFromLocal(KL_TOPIC);
            delete topics[topicId];
            jsonToLocal(KL_TOPIC, topics);
            window.location.href = PATH;
        }
    };
    navAdds.appendChild(deleteButton);

    const assignButton = createAnchor(
        `${PATH}?page=iter-add`,
        '<i class="fa-solid fa-plus"></i>'
    );
    assignButton.className = 'btn btn-tp';
    navAdds.appendChild(assignButton);
}

function renderTopicChartById(elId, dates, vals, regress) {
    const canvas = document.createElement('canvas');
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Values',
                    data: vals,
                    borderWidth: 0,
                    borderRadius: 5,
                    backgroundColor: 'darkgoldenrod',
                    borderColor: 'darkgoldenrod'
                },
                {
                    label: 'Regression',
                    data: regress,
                    borderWidth: 1,
                    pointRadius: 0,
                    borderWidth: 3,
                    backgroundColor: 'gold',
                    borderColor: 'gold'
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            animation: {
                duration: 0
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    document.getElementById(elId).appendChild(canvas);
}

function renderTopicMetricsById(elId, topic, dates, eq) {
    const daysPassed = Math.floor(
        ((new Date()).getTime() - (new Date(topic.startDate).getTime()))
        /CNT_MILLISINDAY
        );
    
    const x = (topic.targetVal-eq[1])/eq[0];
    let remainingDay = 'Not Possible';
    if (x > 0 & x != Infinity) {
        remainingDay = Math.floor(x-dates.length);
    }
    
    const metrics = {
        'Topic Name' : topic.name,
        'Started At' : topic.startDate,
        'Initial Value' : topic.initVal,
        'Target Value' : topic.targetVal,
        'Days Passed' : daysPassed,
        'Days Remaining' : remainingDay
    }

    const metricGrid = createMetricGrid(metrics);
    document.getElementById(elId).appendChild(metricGrid);
    document.getElementById(elId).style.marginTop = '50px';
}


//?///////////////////////////////////////////////////////////////////////
///////////////////////////// ASSIGNMENT /////////////////////////////////
//////////////////////////////////////////////////////////////////////////
function renderIterInfoById(elId, topic) {
    const nameLabel = document.createElement('label');
    nameLabel.textContent = topic.name;

    document.getElementById(elId).appendChild(nameLabel);
}

function renderIterFormById(elId, topic) {
    const formCont = document.createElement('form');
    formCont.classList.add('form-cont');

    const labelDate = document.createElement('label');
    labelDate.textContent = 'Date';
    const inputDate = document.createElement('input');
    inputDate.setAttribute('type', 'date');
    inputDate.setAttribute('required', 'true');
    inputDate.value = dateToString(new Date());
    formCont.appendChild(labelDate);
    formCont.appendChild(inputDate);

    const labelValue = document.createElement('label');
    labelValue.textContent = 'Value';
    const inputValue = document.createElement('input');
    inputValue.setAttribute('type', 'number');
    inputValue.setAttribute('step', '0.01');
    inputValue.setAttribute('placeholder', 'Leave empty to delete');
    formCont.appendChild(labelValue);
    formCont.appendChild(inputValue);

    const submitButton = document.createElement('button');
    submitButton.style.marginTop = '30px';
    submitButton.classList.add('btn');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Save Iteration';
    formCont.appendChild(submitButton);

    formCont.addEventListener('submit', event => {
        event.preventDefault();
        try {
            const val = (inputValue.value) ? parseFloat(inputValue.value) : null;
            saveIter(
                topic.id,
                new Date(inputDate.value),
                val
            );
            window.location.href = `${PATH}?page=topic-detail`;
        } catch (error) {
            alert(error);
        }
    });

    document.getElementById(elId).appendChild(formCont);
}