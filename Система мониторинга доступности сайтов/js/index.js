const siteListContainer = document.getElementById('site-list');


// функция получения данных
async function getZabbixWebMonitoringData() {
    console.log('Запуск функции получения данных...');
    
    const HTTPtests = await getZabbixHTTPtests(TOKEN);
    const webMonitoringItems = await getZabbixItems(TOKEN);
    const webMonitoringItemsHistory = await getZabbixItemsHistory(TOKEN, webMonitoringItems);
    const webMonitoringItemsHistory24 = await getZabbixItemsHistory24(TOKEN, webMonitoringItems);

    const RequiredFormatData =  getRequiredFormatData(HTTPtests, webMonitoringItems, webMonitoringItemsHistory, webMonitoringItemsHistory24);
    return RequiredFormatData;
}


//  функция получения списка веб-сценариев
async function getZabbixHTTPtests(authToken){
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

        return HTTPtests;

    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}


//  функция получения списка элементов данных
async function getZabbixItems(authToken){
    console.log('Запуск функции получения списка элементов данных...');

    try {
        const webMonitoringRequest = {
            "jsonrpc": "2.0",
            "method": "item.get",
            "params": {
                "output": "extend",
                "hostids": HOST_ID,
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
        
        return webMonitoringItems;

    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}


//  функция получения истории элементов данных
async function getZabbixItemsHistory(authToken, webMonitoringItems){
    console.log('Запуск функции получения истории элементов данных...');

    const itemsides = webMonitoringItems.map(item => item["itemid"]);
    console.log(itemsides);
    try {
        const webMonitoringRequest = {
        "jsonrpc": "2.0",
        "method": "history.get",
        "params": {
            "output": "extend",
            "itemids": itemsides,
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
async function getZabbixItemsHistory24(authToken, webMonitoringItems){
    console.log('Запуск функции получения истории элементов данных...');

    const itemsides = webMonitoringItems.map(item => item["itemid"]);
    console.log(itemsides);
    try {
        const webMonitoringRequest = {
        "jsonrpc": "2.0",
        "method": "history.get",
        "params": {
            "output": "extend",
            "itemids": itemsides,
            "limit": 1440 * webMonitoringItems.length,
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
function getRequiredFormatData(HTTPtests, webMonitoringItems, webMonitoringItemsHistory, webMonitoringItemsHistory24){
    console.log('Запуск функции получения данных в нужном формате...');

    let requiredFormaHistory = {};
    let requiredFormaHistory24 = {};

    webMonitoringItems.forEach(item => {
        requiredFormaHistory[item.itemid] = [];
        requiredFormaHistory24[item.itemid] = [];
    });

    webMonitoringItemsHistory.forEach(item => {
        requiredFormaHistory[item.itemid].push(item);
    });

    webMonitoringItemsHistory24.forEach(item => {
        requiredFormaHistory24[item.itemid].push(item);
    });

    let requiredFormatData = [];
    webMonitoringItems.forEach(item => {

        let status = "down";
        if (requiredFormaHistory[item.itemid].at(-1).value == 0) {
            status = "up";
        }

        requiredFormatData.push({
            "id": item.itemid,
            "status": status,
            "name": item.name,
            "url": HTTPtests.find(test => test.name == item.name)?.steps[0]?.url,
            "uptime": new Date(requiredFormaHistory[item.itemid].at(-1).clock * 1000),
            "downtimes": requiredFormaHistory24[item.itemid],
            "selectedStatuses": selectStatuses(requiredFormaHistory[item.itemid]),
        })
    });

    console.log('Данные в нужном формате:', requiredFormatData);

    return requiredFormatData
}


//функция выделяющяя состояния сайта
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



async function displaySites() {
    console.log('Запуск функции отображающей данные на экране...')

    const sites = await getZabbixWebMonitoringData();
    console.log(sites);

    siteListContainer.innerHTML = '';

    sites.forEach(site => {
        const siteCard = document.createElement('div');
        siteCard.classList.add('site-card');
        siteCard.classList.add(site.status === 'up' ? 'up' : 'down');

        siteCard.addEventListener('click', () => {
            window.location.href = `pages/site-details.html?id=${site.id}`;
        });

        const h3 = document.createElement('h3');
        h3.textContent = site.name;
        siteCard.appendChild(h3);

        const link = document.createElement('a');
        link.href = site.url;
        link.textContent = site.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        siteCard.appendChild(link);

        const statusParagraph = document.createElement('p');
        statusParagraph.textContent = 'Статус: ';
        const statusSpan = document.createElement('span');
        statusSpan.classList.add('status-indicator');
        statusSpan.classList.add(site.status === 'up' ? 'up' : 'down');
        statusSpan.textContent = site.status;
        statusParagraph.appendChild(statusSpan);
        siteCard.appendChild(statusParagraph);

        const changeParagraph = document.createElement('p');
        changeParagraph.innerHTML = `Время изменения: ${createTime(new Date(site.selectedStatuses.at(-1).start * 1000))}`;
        siteCard.appendChild(changeParagraph);

        const uptimeParagraph = document.createElement('p');
        uptimeParagraph.innerHTML = `Время последней проверки: <br /> ${createTime(site.uptime)}`;
        siteCard.appendChild(uptimeParagraph);

        const downtimeChart = createDowntimeChart(site.downtimes, site.uptime);
        siteCard.appendChild(downtimeChart);

        siteListContainer.appendChild(siteCard);
    });
}


// Функция для создания времени uptime
function createTime(uptime) {

    return uptime.toLocaleString("ru")
}


// Функция для создания графика downtime
function createDowntimeChart(downtimes, uptime) {
    const chart = document.createElement('div');
    chart.classList.add('downtime-chart');

    let minTime = false;
    const downtimeWidth = 100 / downtimes.length;

    let left = 0;
    downtimes.forEach(downtime => {
        const bar = document.createElement('div');
        bar.classList.add('downtime-bar');

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

        chart.appendChild(bar);
    });

    return chart;
}


document.addEventListener('DOMContentLoaded', () => {
    displaySites();
    setInterval(displaySites, 60000);
});