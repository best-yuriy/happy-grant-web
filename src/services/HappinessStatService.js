import { getData, putData } from "./LocalStorageService";
import { putData as firestorePutData } from "./FirestoreStorageService"
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday);

function _getHappinessStats() {
    const stats = (getData()['happiness-stats'] || [])
    return stats;
}

async function _putHappinessStats(stats) {
    await firestorePutData({ 'happiness-stats': stats });
    putData({ 'happiness-stats': stats });
}

// Input dates in this module are always converted to calendar date strings.
function _toCalendarDayString(date) {
    if (typeof date === 'string' || date instanceof String) {
        return date;
    }
    else if (dayjs.isDayjs(date)) {
        return date.format('YYYY-MM-DD');
    }
    else {
        throw new Error(`Expected dayjs or String, but got ${typeof date}: ${date}.`);
    }
}

function getStat(date) {
    date = _toCalendarDayString(date);

    const stats = _getHappinessStats();
    const stat = stats.find(element => element['date'] === date) || {};
    return stat['value'];
}

async function setStat(date, value) {
    date = _toCalendarDayString(date);

    const stats = _getHappinessStats();
    const index = stats.findIndex(element => element['date'] >= date);

    if (index === -1) {
        stats.push({ date, value });
        await _putHappinessStats(stats);
    }
    else if (stats[index]['date'] === date) {
        stats[index]['value'] = value;
        await _putHappinessStats(stats);
    }
    else {
        const newStats = 
            stats.slice(0, index)
                .concat([{ date, value }])
                .concat(stats.slice(index));
        await _putHappinessStats(newStats);
    }
}

function getStatsDaily(startDate, endDate) {
    startDate = _toCalendarDayString(startDate);
    endDate = _toCalendarDayString(endDate);

    const stats = _getHappinessStats();

    const maybeStartIndex = stats.findIndex(element => element['date'] >= startDate);
    if (maybeStartIndex === -1) return [];

    const maybeEndIndex = stats.findIndex(element => element['date'] >= endDate);
    const endIndex = maybeEndIndex === -1 ? stats.length : maybeEndIndex;

    return stats.slice(maybeStartIndex, endIndex);
}

function getStatsWeekly(startDate, endDate) {    
    startDate = _toCalendarDayString(startDate);
    endDate = _toCalendarDayString(endDate);
    
    const stats = getStatsDaily(startDate, endDate);
    const res = [];

    for (let i = 0; i < stats.length;) {
        const weekStart = dayjs(stats[i].date).weekday(0);
        const weekEnd = dayjs(stats[i].date).weekday(7);

        var sum = 0;
        var num = 0;
        do {
            sum += stats[i].value;
            num++;
            i++;
        } while (i < stats.length && dayjs(stats[i].date).isBefore(weekEnd));

        res.push({ date: _toCalendarDayString(weekStart), value: sum / num });
    }

    return res;
}

export { getStat, setStat, getStatsDaily, getStatsWeekly };
