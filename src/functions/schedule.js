import ICalParser from "ical-js-parser";
const parseTime = (string) => {
    return new Date(
        [
          string.slice(0, 4) + "-",
          string.slice(4, 6) + "-",
          string.slice(6, 8) + "T",
          string.slice(9, 11) + ":",
          string.slice(11, 13) + ":",
          string.slice(13, 15) + "Z",
        ].join(""),
    ).valueOf();
}

const fetchSchedule = async (url) => {
    const response = await fetch(url)
    let d = {};
    try {
        let data = await response.blob();
        data = await data.text();
        const ics = ICalParser.toJSON(data);
        console.log(ics)
        for (let i = 0; i < ics.events.length; i++) {
          d[ics.events[i].uid.split("@")[0]] = {
            startDate: parseTime(ics.events[i].dtstart.value),
            uid: ics.events[i].uid.split("@")[0],
            formattedStart: new Date(parseTime(ics.events[i].dtstart.value)).toLocaleTimeString("us-en", { hour: 'numeric', minute: 'numeric', hour12: true }),
            endDate: parseTime(ics.events[i].dtend.value),
            formattedEnd: new Date(parseTime(ics.events[i].dtend.value)).toLocaleTimeString("us-en", { hour: 'numeric', minute: 'numeric', hour12: true }),
            subject: ics.events[i].summary,
            room: ics.events[i].location !== "" ? ics.events[i].location : "No room",
            teacher: ics.events[i].description.split(' : ')[1],
            text: ics.events[i].summary + ' - ' + (ics.events[i].location !== "" ? ics.events[i].location : "No room") + ' - ' + ics.events[i].description.split(' : ')[1],
          }
        }
    } catch (error) {
        console.log(error)
        d = null
    }
    return d
}
export {parseTime, fetchSchedule}