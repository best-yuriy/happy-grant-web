import { NavLink } from "react-router-dom";
import Login from '../../assets/login.svg'
import Logout from '../../assets/logout.svg'
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

function AccountNavLink() {
    const [loggedIn, setLoggedIn] = useState(auth.currentUser != null);

    useEffect(
        () => onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true);
            }
            else {
                setLoggedIn(false);
            }
        }),
        []
    );

    return (
        <NavLink to={loggedIn ? "/logout" : "/login"} className="nav-item logout-login">
            <img src={loggedIn ? Logout : Login} alt={loggedIn ? "sign out" : "sign in"}/>
        </NavLink>
    );
}

export default AccountNavLink;
