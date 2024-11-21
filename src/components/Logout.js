import { useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Logout() {

    const [logoutStatus, setLogoutStatus] = useState("Logging out...");

    signOut(auth)
        .then(() => {
            setLogoutStatus("You are logged out.");
        })
        .catch((error) => {
            setLogoutStatus("There was a problem logging you out.");
        });

    return (
        <div>
            <p id='logout-status'>{logoutStatus}</p>
        </div>
    );
}

export default Logout;
