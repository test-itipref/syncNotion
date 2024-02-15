function addEventsToCalendar() {
    var notionItems = fetchNotionItems();
    var calendar = CalendarApp.getCalendarById(calendarId());
    var calendarEvents = fetchCalendarEvents(calendar);

    deleteObsoleteCalendarEvents(calendarEvents, notionItems);
    updateOrAddCalendarEvents(calendar, notionItems);
}

function fetchNotionItems() {
    var response = UrlFetchApp.fetch(notionApiUrl(), notionApiRequestOptions());
    var data = JSON.parse(response.getContentText());
    return data.results;
}

function fetchCalendarEvents(calendar) {
    var oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    var oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    return calendar.getEvents(oneMonthAgo, oneYearLater);
}

function deleteObsoleteCalendarEvents(calendarEvents, notionItems) {
    var notionTitles = notionItems.map(item => getItemTitle(item)).filter(title => title);
    calendarEvents.forEach(event => {
        if (notionTitles.indexOf(event.getTitle()) === -1) {
            event.deleteEvent();
            Logger.log('Delete : ' + event.getTitle());
        }
    });
}

function updateOrAddCalendarEvents(calendar, notionItems) {
    notionItems.forEach(item => {
        var title = getItemTitle(item);
        var newDeadline = getItemDeadline(item);
        var itemUrl = getItemUrl(item);
        Logger.log('Process: ' + title);
        if (title && newDeadline) {
            updateCalendarEventDescription(calendar, title, newDeadline, itemUrl);
            addNewCalendarEvent(calendar, title, newDeadline, itemUrl);
        }
    });
}

function updateCalendarEventDescription(calendar, title, deadline, url) {
    var events = calendar.getEventsForDay(deadline, { search: title });
    events.forEach(event => {
        if (event.getTitle() === title && event.getStartTime().getTime() === deadline.getTime()) {
            if (event.getDescription() !== url) {
                event.setDescription(url);
                Logger.log('Update Description for: ' + title);
            }
        }
    });
}

function addNewCalendarEvent(calendar, title, deadline, url) {
    var existingEvents = calendar.getEventsForDay(deadline, { search: title });
    if (existingEvents.length === 0 || !existingEvents.some(event => event.getTitle() === title)) {
        calendar.createEvent(title, deadline, deadline, { description: url });
        Logger.log('Create : ' + title);
    }
}

function notionApiUrl() {
    return 'https://api.notion.com/v1/databases/' + databaseId() + '/query';
}

function notionApiRequestOptions() {
    return {
        'method': 'post',
        'headers': {
            "Authorization": "Bearer " + PropertiesService.getScriptProperties().getProperty('NOTION_API_KEY'),
            "Notion-Version": "2021-08-16"
        }
    };
}

function getItemTitle(item) {
    return item.properties.名前 && item.properties.名前.title.length > 0
        ? item.properties.名前.title[0].text.content
        : null;
}

function getItemDeadline(item) {
    return item.properties.期限 && item.properties.期限.date
        ? new Date(item.properties.期限.date.start)
        : null;
}

function getItemUrl(item) {
    return item.properties.URL && item.properties.URL.url
        ? item.properties.URL.url
        : '';
}

function calendarId() {
    return PropertiesService.getScriptProperties().getProperty('CALENDAER_ID');
}

function databaseId() {
    return PropertiesService.getScriptProperties().getProperty('DATABASE_ID');
}