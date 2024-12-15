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
import { useEffect, useState } from 'react'
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

function DayHappinessPrompt({ onError }) {

    const today = () => dayjs().startOf('day');

    const [date, setDate] = useState(today);
    const [value, setValue] = useState(80);
    const [savedValue, setSavedValue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let canceled = false;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const existingValue = await getHappinessLevel(date);
                if (!canceled) {
                    setSavedValue(existingValue);
                    setValue(existingValue || 80);
                }
            }
            catch (error) {
                onError('There was an error while loading data.');
                console.log('There was an error while loading data:', error);
            }
            finally {
                if (!canceled) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => { canceled = true };
    }, [date]);

    function tryChangeDays(numDays) {
        if (isSaving) {
            return;
        }

        const newDate = date.add(numDays, 'day');
        if (!today().isBefore(newDate)) {
            setDate(newDate);
        }
    }

    async function trySave() {
        if (isSaving || isLoading || value === savedValue) {
            return;
        }

        setIsSaving(true);
        try {
            await setHappinessLevel(date, value);
            setSavedValue(value);
        }
        catch (error) {
            onError('There was a problem saving your happiness stats.');
            console.log('There was a problem saving your happiness stats:', error);
        }
        finally {
            setIsSaving(false);
        }
    }

    function displayIfMoodBetween(min, max) {
        return { display: value >= min && value < max ? "block" : "none" };
    }

    return (
        <div id='day-happiness-prompt' className='flex-column'>
            <div className='header flex-column-fixed'>
                <span>{date.format('MMM DD YYYY')}</span>
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
                        <SliderComponent value={value} setValue={setValue}/>
                    </div>

                    <div className='buttons flex-column-fixed flex-row'>
                        <div className='button' onClick={() => tryChangeDays(-1)}>
                            <img src={chevronBackward} alt='back'/>
                        </div>
                        <div
                            className={`button primary${value === savedValue ? ' locked' : ''}`}
                            onClick={trySave}
                        >
                            <img src={isSaving || isLoading ? pendingCircle : checkCircle} alt='save'/>
                        </div>
                        <div className='button' onClick={() => tryChangeDays(1)}>
                            <img src={chevronForward} alt='forward'/>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default DayHappinessPrompt;
