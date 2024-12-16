import dayjs from 'dayjs';
import { getStatsDaily, getStatsWeekly } from './HappinessStatService';

// start: dayjs - the start date (inclusive)
// end: dayjs - the end date (exclusive)
// step: dayjs => dayjs - function to calculate the next date
// get: dayjs => T - function to calculate the value for the date
function getRange(start, end, step, get) {
    const res = [];
    
    let date = start;
    while (date.isBefore(end)) {
        res.push(get(date));
        date = step(date)
    }

    return res;
}

async function getDailyStats(start, end) {
    const stats = getStatsDaily(start, end);
    const res = [];

    function addEmpties(from, to) {
        while (from.isBefore(to)) {
            res.push({ date: from, value: null });
            from = from.add(1, 'day');
        }
    }

    for (let i = 0; i < stats.length; i++) {
        const nextDate = dayjs(stats[i].date);
        addEmpties(start, nextDate);
        res.push({ date: nextDate, value: stats[i].value });
        start = nextDate.add(1, 'day');
    }

    addEmpties(start, end)

    return res;
}

function getDailyLabels(start, end) {
    return getRange(start, end, d => d.add(1, 'day'), x => x);
}

async function getWeeklyStats(start, end) {
    const stats = getStatsWeekly(start, end);
    const res = [];

    function addEmpties(from, to) {
        while (from.isBefore(to)) {
            res.push({ date: from, value: null });
            from = from.add(7, 'day');
        }
    }

    for (let i = 0; i < stats.length; i++) {
        const nextDate = dayjs(stats[i].date);
        addEmpties(start, nextDate);
        res.push({ date: nextDate, value: stats[i].value });
        start = nextDate.add(7, 'day');
    }

    addEmpties(start, end)

    return res;
}

function getWeeklyLabels(start, end) {
    return getRange(start, end, d => d.add(7, 'day'), x => x);
}

export { getDailyLabels, getWeeklyLabels, getDailyStats, getWeeklyStats };
