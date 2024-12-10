import { useLocation } from "react-router-dom";

function CurrentLocation() {
    const location = useLocation();
    return <div>Current route: '{location.pathname}'</div>;
}

export default CurrentLocation;
