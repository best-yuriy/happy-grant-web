import './Info.css'
import { putData } from '../../services/LocalStorageService';

const LastInfoDate = '2024-10-27';
const LastSeenInfoDateStorageKey = 'lastSeenInfoDate'

function Info() {
    putData({ [LastSeenInfoDateStorageKey]: LastInfoDate });

    return (
        <div id='info'>
            <section>
                <h1>Oct 27, 2024</h1>
                <p>This is a preview version of the app. Your data is stored locally in your browser's storage. This means that your data will not transfer from one device to another. Synchronizing data will be added in a future version.</p>
            </section>
        </div>
    );
}

export default Info;
export { LastInfoDate, LastSeenInfoDateStorageKey };
