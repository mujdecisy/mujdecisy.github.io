const ID_NAVADDS = 'nav-additions';
const PAD_NUM = 2;
const PAD_VAL = '0';

function dateToString(dateDate) {
    const year = dateDate.getFullYear();
    const month = (dateDate.getMonth() + 1).toString().padStart(PAD_NUM, PAD_VAL);
    const day = dateDate.getDate().toString().padStart(PAD_NUM, PAD_VAL);
    return `${year}-${month}-${day}`;
}

function jsonFromLocal(key, defaultValue = {}) {
    const value = localStorage.getItem(key);
    if (value) {
        return JSON.parse(value);
    }
    return defaultValue;
}

function jsonToLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function createAnchor(link, innerHTML) {
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.innerHTML = innerHTML;
    return anchor;
}

function createConductToPage(message, buttonLabel, link) {
    const container = document.createElement('div');

    const msgElement = document.createElement('p');
    msgElement.textContent = message;
    msgElement.style.textAlign = 'center';
    const aElement = createAnchor(link, buttonLabel);
    aElement.className = 'btn btn-tp btn-ul';
    aElement.style.maxWidth = '350px';
    aElement.style.margin = '0px auto';

    container.appendChild(msgElement);
    container.appendChild(aElement);

    return container;
}

function createMetricGrid(metrics) {
    const metricGrid = document.createElement('div');
    metricGrid.classList.add('metric-grid');
    for (const [key, value] of Object.entries(metrics)) {
        const keyCell = document.createElement('div');
        keyCell.classList.add('metric-key');
        keyCell.textContent = `${key}:`;
        const valueCell = document.createElement('div');
        valueCell.classList.add('metric-value');
        valueCell.textContent = `${value}`;
        metricGrid.appendChild(keyCell);
        metricGrid.appendChild(valueCell);
    }
    return metricGrid;
}


function renderNavigationBarById(link, title) {
    const navigationBar = document.createElement('nav');

    const appName = createAnchor(link, title);
    appName.style.borderBottom = '5px solid gold';
    appName.className = 'no-deco nav-header';

    const additionals = document.createElement('div');
    additionals.id = 'nav-additions';

    navigationBar.appendChild(appName);
    navigationBar.appendChild(additionals);

    document.getElementById('navigation').replaceChildren(navigationBar);
}


//?///////////////////////////////////////////////////////////////////////
////////////////////////////// INPUTOUTPUT ///////////////////////////////
//////////////////////////////////////////////////////////////////////////
function renderAdditionalsIoPage() {
    const navAdds = document.getElementById(ID_NAVADDS);
    const copyButton = document.createElement('button');
    copyButton.innerHTML = '<i class="fa-solid fa-copy"></i>';
    copyButton.className = 'btn btn-tp';
    copyButton.addEventListener('click', () => {
        document.getElementById('data-json').getElementsByTagName('textarea')[0].select();
        document.execCommand('copy');
    });
    navAdds.appendChild(copyButton);
}


function renderIoTextById(localKeys) {
    const dataJsonInit = {};
    for(const key of localKeys) {
        dataJsonInit[key] = jsonFromLocal(key);
    }

    const textArea = document.createElement('textarea');
    textArea.rows = '10';
    textArea.style.width = '98%';
    textArea.value = JSON.stringify(dataJsonInit, undefined, 2);

    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.className = 'btn btn-sm';
    saveButton.style.margin = '20px auto';
    saveButton.style.width = '60%';
    saveButton.addEventListener('click', () => {
        const dataJson = JSON.parse(textArea.value);
        for (const key of localKeys) {
            jsonToLocal(key, dataJson[key]);
        }
        window.location.href = `${PATH}?page=io`;
    });

    const container = document.getElementById('data-json');
    container.appendChild(textArea);
    container.appendChild(saveButton);
}