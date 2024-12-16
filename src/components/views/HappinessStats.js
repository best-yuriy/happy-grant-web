import './HappinessStats.css';
import { Line } from 'react-chartjs-2';
import {
    Chart,
    CategoryScale,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip
} from 'chart.js';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import { useEffect, useState } from 'react';
import { getDailyLabels, getWeeklyLabels, getDailyStats, getWeeklyStats } from '../../services/HappinessTimeSeriesUtils';

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

async function getChartData(mode) {
    const today = dayjs().startOf('day');
    const tomorrow = today.add(1, 'day');

    let start;
    let stats;
    let dates;

    switch(mode) {
        case '7d':
            start = today.subtract(6, 'day');
            stats = await getDailyStats(start, tomorrow);
            dates = getDailyLabels(start, tomorrow);
            break;
        case '6w':
            start = today.weekday(0).subtract(7 * 6, 'day');
            stats = await getWeeklyStats(start, tomorrow);
            dates = getWeeklyLabels(start, tomorrow);
            break;
        default:
            throw new Error(`Invalid mode: ${mode}.`);        
    }

    const labels = dates.map(d => d.format('YYYY-MM-DD'));
    const happinessData = stats.map(e => e.value);

    return {
        labels: labels,
        datasets: [
            {
                data: happinessData,
                borderColor: 'lightblue'
            }
        ]
    };
}

function HappinessStats() {

    const [mode, setMode] = useState('7d');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            const newChartData = await getChartData(mode);
            if (!cancelled) {
                setChartData(newChartData);
            }
        };

        fetchData();

        return () => { cancelled = true };
    }, [mode]);

    return (
        <div id='happiness-stats'>
            <div className='stats-mode-selector'>
                <button className='stats-mode-choice' onClick={() => setMode('7d')}>7d</button>
                <button className='stats-mode-choice' onClick={() => setMode('6w')}>6w</button>
            </div>
            <Line
                data={chartData}
                options={chartOptions(chartData.labels)}
            />
        </div>
    );
}

export default HappinessStats;
