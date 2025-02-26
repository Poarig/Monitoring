const addSiteButton = document.getElementById('add-site-button');
const siteName = document.getElementById('site-name');
const siteUrl = document.getElementById('site-url');
const timeline = document.getElementById('timeline');
const timelineLabels = document.getElementById('timeline-labels');
const uptime = document.getElementById('uptime');
const downtimesNumber = document.getElementById('downtimes-number');
const lastEvents = document.getElementById('last-events');


// функция получения данных
async function getZabbixWebMonitoringData() {
    console.log('Запуск функции получения данных...');

    const itemID = new URLSearchParams(window.location.search).get('id');
    
    const webMonitoringItems = await getZabbixItem(TOKEN, itemID);
    console.log(webMonitoringItems.name);
    const HTTPtests = await getZabbixHTTPtest(TOKEN, webMonitoringItems.name);
    const webMonitoringItemsHistory = await getZabbixItemHistory(TOKEN, itemID);
    const webMonitoringItemsHistory24 = await getZabbixItemHistory24(TOKEN, itemID);

    const RequiredFormatData =  getRequiredFormatData(HTTPtests, itemID, webMonitoringItemsHistory, webMonitoringItemsHistory24);
    return RequiredFormatData;
}


//  функция получения списка веб-сценариев
async function getZabbixHTTPtest(authToken, name){
    console.log('Запуск функции получения списка веб-сценариев...');

    try {
        const webMonitoringRequest = {
            "jsonrpc": "2.0",
            "method": "httptest.get",
            "params": {
                "output": ["name", ],
                "selectSteps": "extend",
                "filter": {
                    "hostid": HOST_ID,
                    "name": name,
                }
            },
            "id": 1
        };
  
        console.log('Отправка запроса на получение веб-сценариев...');
        const webMonitoringResponse = await fetch(ZABBIX_URL, {
            'method': 'POST',
            'headers': {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(webMonitoringRequest)
        });
  
        const webMonitoringData = await webMonitoringResponse.json();
        console.log('Ответ от сервера получения веб-сценариев:', webMonitoringData);
  
        if (webMonitoringData.error) {
            throw new Error(`Ошибка получения веб-сценариев: ${webMonitoringData.error.message}`);
        }
  
        const HTTPtests = webMonitoringData.result;
        console.log('Список веб-сценариев:', HTTPtests);

        return HTTPtests[0];

    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}


//  функция получения списка элементов данных
async function getZabbixItem(authToken, itemID){
    console.log('Запуск функции получения списка элементов данных...');

    try {
        const webMonitoringRequest = {
            "jsonrpc": "2.0",
            "method": "item.get",
            "params": {
                "output": "extend",
                "hostids": HOST_ID,
                "itemids": itemID,
            },
            "id": 1
        };

        console.log('Отправка запроса на получение списка элементов данных...');
        const webMonitoringResponse = await fetch(ZABBIX_URL, {
        'method': 'POST',
        'headers': {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(webMonitoringRequest)
        });

        const webMonitoringData = await webMonitoringResponse.json();
        console.log('Ответ от сервера получения списка элементов данных:', webMonitoringData);
        
        if (webMonitoringData.error) {
            throw new Error(`Ошибка получения списка элементов данных: ${webMonitoringData.error.message}`);
        }
    
        const webMonitoringItems = webMonitoringData.result;
        console.log('Список элементов данных:', webMonitoringItems);
        
        return webMonitoringItems[0];

    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}


//  функция получения истории элементов данных
async function getZabbixItemHistory(authToken, itemID){
    console.log('Запуск функции получения истории элементов данных...');

    console.log(itemID);
    try {
        const webMonitoringRequest = {
        "jsonrpc": "2.0",
        "method": "history.get",
        "params": {
            "output": "extend",
            "itemids": itemID,
        },
        "id": 1
        };

        console.log('Отправка запроса на получение истории элементов данных...');
        const webMonitoringResponse = await fetch(ZABBIX_URL, {
        'method': 'POST',
        'headers': {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(webMonitoringRequest)
        });

        const webMonitoringData = await webMonitoringResponse.json();
        console.log('Ответ от сервера получения истории элементов данных:', webMonitoringData);
        if (webMonitoringData.error) {
            throw new Error(`Ошибка получения истории элементов данных: ${webMonitoringData.error.message}`);
        }
        const webMonitoringItemsHistory = webMonitoringData.result;

        console.log('Истории элементов данных:', webMonitoringItemsHistory);
        
        return webMonitoringItemsHistory;

    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}


//  функция получения истории элементов данных за 24 часа
async function getZabbixItemHistory24(authToken, itemID){
    console.log('Запуск функции получения истории элементов данных...');

    console.log(itemID);
    try {
        const webMonitoringRequest = {
        "jsonrpc": "2.0",
        "method": "history.get",
        "params": {
            "output": "extend",
            "itemids": itemID,
            "limit": 1440,
            "sortfield": "clock",
            "sortorder": "DESC",
        },
        "id": 1
        };

        console.log('Отправка запроса на получение истории элементов данных...');
        const webMonitoringResponse = await fetch(ZABBIX_URL, {
        'method': 'POST',
        'headers': {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(webMonitoringRequest)
        });

        const webMonitoringData = await webMonitoringResponse.json();
        console.log('Ответ от сервера получения истории элементов данных:', webMonitoringData);
        if (webMonitoringData.error) {
            throw new Error(`Ошибка получения истории элементов данных: ${webMonitoringData.error.message}`);
        }
        const webMonitoringItemsHistory = webMonitoringData.result;

        console.log('Истории элементов данных:', webMonitoringItemsHistory);
        
        return webMonitoringItemsHistory.reverse();

    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}


//  функция получения данных в нужном формате
function getRequiredFormatData(HTTPtests, itemID, webMonitoringItemsHistory, webMonitoringItemsHistory24){
    console.log('Запуск функции получения данных в нужном формате...');

    let status = "down";
    if (webMonitoringItemsHistory.at(-1).value == 0) {
        status = "up";
    }

    const requiredFormatData = {
        "id": itemID,
        "status": status,
        "name": HTTPtests.name,
        "url": HTTPtests.steps[0].url,
        "uptime": new Date(webMonitoringItemsHistory.at(-1).clock * 1000),
        "downtimes": webMonitoringItemsHistory24,
        "selectedStatuses": selectStatuses(webMonitoringItemsHistory),
    }

    console.log('Данные в нужном формате:', requiredFormatData);

    return requiredFormatData
}


//  функция получающая выделяющяя состояния сайта
function selectStatuses(downtimes) {
    let selectedItemStatuses = [];
    let lastStatus = NaN;
    let start = false;
    let end = NaN;
    
    downtimes.forEach(status => {
        if (status.value != lastStatus) {
            if (start != false) {
                selectedItemStatuses.push({
                    "status": lastStatus,
                    "end": end,
                    "start": start,
                })
            }
            lastStatus = status.value;
            start = status.clock;
        }

        end = status.clock;
    });

    if ((start != false)) {
        selectedItemStatuses.push({
            "status": lastStatus,
            "end": end,
            "start": start,
        })
    }

console.log(selectedItemStatuses);
return selectedItemStatuses;
}



//  функция обновляющая временную шкалу
function updateDowntimeChart(downtimes) {
    
    let minTime = false;
    const downtimeWidth = 100 / downtimes.length;

    let left = 0;
    timeline.innerHTML = "";
    downtimes.forEach(downtime => {
        const bar = document.createElement('div');
        bar.classList.add('downtime-bar');

        bar.title = createTime(downtime.clock, withSeconds=true);

        if (downtime.value == 0) {
            bar.classList.add('up');
        } else {
            bar.classList.add('down');
        }

        const time = new Date(downtime.clock * 1000);
        if (!minTime){
            minTime = time;
        }

        bar.style.left = `${left}%`;
        bar.style.width = `${downtimeWidth}%`;

        left += downtimeWidth;

        timeline.appendChild(bar);
    });

    timelineLabels.innerHTML = "";
    timeStep = ((downtimes.at(-1).clock - downtimes[0].clock) / 9);
    for (i = 0; i < 9; i++){
        const label = document.createElement('span');
        label.innerText = createTime(Number(downtimes[0].clock) + Number(i * timeStep));
        timelineLabels.appendChild(label);
    }
}


//  функция создающая создающая строку обозначающую время в нужном формате
function createTime(date, withSeconds=false) {
    date = new Date(date * 1000);
    let time = date.getHours() + ":" + date.getMinutes().toString().padStart(2, "0");
    if (withSeconds) {
        time = time + ":" + date.getSeconds().toString().padStart(2, "0");
    }
    return time
}


//  функция обновляющая статистику
function updateStatistics(site) {
    const downtimes = site.downtimes;
    const selectedStatuses = site.selectedStatuses;
    let uptimesNumber = 0;
    downtimes.forEach(downtime => {
        if (downtime.value == 0) {
            uptimesNumber ++;
        }
    });
    uptime.innerText = (uptimesNumber / downtimes.length * 100).toFixed(2);

    let allDowntimesNumber = 0
    selectedStatuses.forEach(status => {
        if (status.status != 0) {
            allDowntimesNumber += 1;
        }
    });
    downtimesNumber.innerText = allDowntimesNumber;
}


//  функция обновляющая последние события
function updateEvents(selectedStatuses) {
    lastEvents.innerText = "";
    
    selectedStatuses.reverse().forEach(event => {
        console.log(event)
        let li = document.createElement('li')
        let status = "Даунтайм";
        if (event.status == 0) {
            status = "Аптайм";
        }
        let time = new Date(event.start * 1000).toLocaleString("ru");

        li.innerText = `${time} Сайт перешел в состояние "${status}"`;

        lastEvents.appendChild(li)
    });

    
}


//  функция обновляющая все данные на сайте
async function updateData() {
    const site = await getZabbixWebMonitoringData();
    console.log(site);
    siteName.innerText = site.name;

    siteUrl.innerText = site.url;
    siteUrl.href = site.url;

    updateDowntimeChart(site.downtimes);

    updateStatistics(site);

    updateEvents(site.selectedStatuses);
}

document.addEventListener('DOMContentLoaded', () => {
    updateData();
    setInterval(updateData, 60000);
});