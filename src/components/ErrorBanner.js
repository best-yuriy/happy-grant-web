import './ErrorBanner.css'
import closeIcon from '../assets/close.svg'

function ErrorBanner({ message, onClose }) {
    if (!message) return null;

    return (
        <div className='error-banner' onClick={onClose}>
            <p className='error-message'>{message}</p>
            
            <img
                className='close-icon'
                src={closeIcon}
                alt='close'
                onClick={onClose}
            />
        </div>
    );
}

export default ErrorBanner;
