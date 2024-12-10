import './DayHappinessPrompt.css'
import chevronBackward from '../../assets/chevron-backward.svg'
import chevronForward from '../../assets/chevron-forward.svg'
import checkCircle from '../../assets/check-circle.svg'
import pendingCircle from '../../assets/pending-circle.svg'
import ecstatic from '../../assets/ecstatic.png'
import happy from '../../assets/happy.png'
import thoughtful from '../../assets/thoughtful.png'
import sad from '../../assets/sad.png'
import crying from '../../assets/crying.png'
import { useState } from 'react'
import dayjs from 'dayjs'
import { setHappinessLevel, getHappinessLevel } from '../../services/HappinessLevelRepo'
import { Direction, Range, getTrackBackground } from "react-range";

function SliderComponent({ value, setValue }) {
    return (
        <Range
            label="Select your value"
            step={1}
            min={0}
            max={100}
            values={[value]}
            onChange={(values) => setValue(values[0])}
            direction={Direction.Right}
            renderTrack={({ props, children }) => (
                <div
                    className='slider-track'
                    {...props}
                    style={{...props.style, background: getTrackBackground({
                        values: [value],
                        colors: ["#add8e6", "#d3d3d3"],
                        min: 0,
                        max: 100
                    })}}
                >
                    {children}
                </div>
            )}
            renderThumb={({ props }) => (
                <div className='slider-thumb' {...props} style={props.style} key={props.key}>
                    <div className='slider-thumb-label'>
                        {value}
                    </div>
                </div>
            )}
        />
    );
}

function moodImageFrom(moodValue) {
    if (moodValue < 20) return crying;
    if (moodValue < 40) return sad;
    if (moodValue < 60) return thoughtful;
    if (moodValue < 80) return happy;
    return ecstatic;
}

function DayHappinessPrompt({ onError }) {

    const today = () => dayjs().startOf('day');

    function initState(date) {
        const existingValue = getHappinessLevel(date);
        return {
            date,
            value: existingValue || 80,
            savedValue: existingValue,
            status: existingValue ? 'SAVED' : 'UNSAVED'
        };
    }

    const [state, setState] = useState(initState(today()));

    function changeDays(numDays) {
        const newDate = state.date.add(numDays, 'day');
        if (!today().isBefore(newDate)) {
            setState(initState(newDate));
        }
    }

    function setHappinessLevelState(value) {
        setState({ ...state, value, status: value == state.savedValue ? 'SAVED' : 'UNSAVED' });
    }

    async function saveHappinessLevel() {
        if (state.status === 'UNSAVED') {
            setState({ ...state, status: 'SAVING' });
            try {
                await setHappinessLevel(state.date, state.value);
                setState({ ...state, savedValue: state.value, status: 'SAVED' });
            } catch (error) {
                setState({ ...state, status: 'UNSAVED' });
                onError('There was a problem saving your happiness stats.');
                console.log('There was a problem saving your happiness stats:', error);
            }
            
            
        }
    }

    function displayIfMoodBetween(min, max) {
        return { display: state.value >= min && state.value < max ? "block" : "none" };
    }

    return (
        <div id='day-happiness-prompt' className='flex-column'>
            <div className='header flex-column-fixed'>
                <span>{state.date.format('MMM DD YYYY')}</span>
            </div>

            <div className='flex-column-main'>
                <div className='mood-prompt-controls flex-column'>

                    <div className='flex-column-main'>
                        <img className='mood-level-image' style={displayIfMoodBetween( 0, 20)}  src={crying}     alt='crying-face'/>
                        <img className='mood-level-image' style={displayIfMoodBetween(20, 40)}  src={sad}        alt='sad-face'/>
                        <img className='mood-level-image' style={displayIfMoodBetween(40, 60)}  src={thoughtful} alt='thoughtful-face'/>
                        <img className='mood-level-image' style={displayIfMoodBetween(60, 80)}  src={happy}      alt='happy-face'/>
                        <img className='mood-level-image' style={displayIfMoodBetween(80, 101)} src={ecstatic}   alt='ecstatic-face'/>
                    </div>

                    <div className='mood-slider flex-column-fixed'>
                        <SliderComponent value={state.value} setValue={setHappinessLevelState}/>
                    </div>

                    <div className='buttons flex-column-fixed flex-row'>
                        <div className='button' onClick={() => changeDays(-1)}>
                            <img src={chevronBackward} alt='back'/>
                        </div>
                        <div
                            className={`button primary${state.value === state.savedValue ? ' locked' : ''}`}
                            onClick={async () => await saveHappinessLevel()}
                        >
                            <img src={state.status === 'SAVING' ? pendingCircle : checkCircle} alt='save'/>
                        </div>
                        <div className='button' onClick={() => changeDays(1)}>
                            <img src={chevronForward} alt='forward'/>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default DayHappinessPrompt;
