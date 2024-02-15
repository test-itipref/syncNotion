# Function Relationships

`addEventsToCalendar`
- `fetchNotionItems`
  - `notionApiUrl`
  - `notionApiRequestOptions`
    - `PropertiesService.getScriptProperties`
- `CalendarApp.getCalendarById`
  - `calendarId`
- `fetchCalendarEvents`
  - `CalendarApp.getCalendarById`
    - `calendarId`
- `deleteObsoleteCalendarEvents`
  - `getItemTitle`
  - `CalendarApp.getCalendarById`
    - `calendarId`
- `updateOrAddCalendarEvents`
  - `getItemTitle`
  - `getItemDeadline`
  - `getItemUrl`
  - `updateCalendarEventDescription`
    - `CalendarApp.getCalendarById`
      - `calendarId`
  - `addNewCalendarEvent`
    - `CalendarApp.getCalendarById`
      - `calendarId`