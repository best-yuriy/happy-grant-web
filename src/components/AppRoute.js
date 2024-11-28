import { Navigate, Outlet } from "react-router-dom";
import { getData } from "../services/LocalStorageService";
import { LastInfoDate, LastSeenInfoDateStorageKey } from "./Info";
import { auth } from "../firebase";

/**
 * If authRequired = true, unauthenticated users will be redirected
 * to /login.
 * 
 * If infoRequired = true, users who haven't seen the latest info will
 * be redirected to /info.
 */
function AppRoute({ authRequired, infoRequired }) {
    
    if (infoRequired &&
        getData()[LastSeenInfoDateStorageKey] !== LastInfoDate
    ) {
        return <Navigate to="/info"/>;
    }
    else if (authRequired && !auth.currentUser) {
        return <Navigate to="/login"/>
    }
    else {
        return <Outlet/>;
    }
}

export default AppRoute;
