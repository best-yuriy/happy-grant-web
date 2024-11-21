import { Navigate, Outlet } from "react-router-dom";
import { getData } from "../services/LocalStorageService";
import { LastInfoDate, LastSeenInfoDateStorageKey } from "./Info";

function AppRoute() {
    
    if (getData()[LastSeenInfoDateStorageKey] === LastInfoDate) {
        return <Outlet />;
    }
    else {
        return <Navigate to="/info" />;
    }
}

export default AppRoute;
