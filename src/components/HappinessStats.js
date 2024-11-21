import './HappinessStats.css'
import { Line } from 'react-chartjs-2';
import {
    Chart,
    CategoryScale,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip
} from 'chart.js'
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday'
import { setHappinessLevel, getHappinessLevel } from '../services/HappinessLevelRepo'
import { useState } from 'react';
import { getStatsDaily, getStatsWeekly } from '../services/HappinessStatService';

dayjs.extend(weekday);

Chart.register(
    CategoryScale,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip
);

// FIXME: we shouldn't need labels here, but we do due to the bug with ticks.
function chartOptions(labels) {
    return {
        scales: {
            x: {
                ticks: {
                    major: {
                        enabled: true
                    },
                    // FIXME: for some reason, value and index give me the same value
                    // and ticks contains an array with the same label repeated over
                    // and over.
                    callback: function(value, index, ticks) {
                        return dayjs(labels[index]).format('MM/DD')
                    }
                }
            },
            y: {
                min: 0,
                max: 100
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: (title) => dayjs(title[0].label).format('MM/DD/YYYY')
                }
            }
        }
    };
}

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

function getDailyStats(start, end) {
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

function getWeeklyStats(start, end) {
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

function HappinessStats() {
    const [state, setState] = useState({ mode: '7d' });

    const today = dayjs().startOf('day');
    const tomorrow = today.add(1, 'day');

    let start;
    let stats;
    let dates;

    switch(state.mode) {
        case '7d':
            start = today.subtract(6, 'day');
            stats = getDailyStats(start, tomorrow);
            dates = getDailyLabels(start, tomorrow);
            break;
        case '6w':
            start = today.weekday(0).subtract(7 * 6, 'day');
            stats = getWeeklyStats(start, tomorrow);
            dates = getWeeklyLabels(start, tomorrow);
            break;
        default:
            throw new Error(`Invalid mode: ${state.mode}.`);        
    }

    const labels = dates.map(d => d.format('YYYY-MM-DD'));
    const happinessData = stats.map(e => e.value);

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: happinessData,
                borderColor: 'lightblue'
            }
        ]
    };

    return (
        <div id='happiness-stats'>
            <div className='stats-mode-selector'>
                <button className='stats-mode-choice' onClick={() => setState({ mode: '7d' })}>7d</button>
                <button className='stats-mode-choice' onClick={() => setState({ mode: '6w' })}>6w</button>
            </div>
            <Line
                data={chartData}
                options={chartOptions(labels)}
            />
        </div>
    );
}

export default HappinessStats;