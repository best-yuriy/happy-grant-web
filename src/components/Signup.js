import './LoginSignup.css'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Signup({ onError }) {
    
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                switch (error.code) {
                    case 'auth/missing-password': // TODO: display error message
                    case 'auth/weak-password': // TODO: display error message
                    case 'auth/missing-email':
                    case 'auth/invalid-email':
                    case 'auth/email-already-in-use': // TODO: display error message
                        onError('Invalid email or password.')
                        break;
                    default:
                        console.log(
                            'unexpected auth error',
                            error.code,
                            error.message
                        );
                        onError("Unexpected auth error.");
                        break;
                }
            });
    }

    return (
        <div className='signup-main flex-column'>
            <form className='signup-form'>

                <label htmlFor="email-input">email</label>
                <input
                    id="email-input"
                    className="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email address"
                />

                <label htmlFor="password-input">password</label>
                <input
                    id="password-input"
                    className="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                />                                          

                <button
                    name="signup"
                    className='signup-button'
                    onClick={onSubmit}
                >  
                    SIGN UP
                </button>
            </form>

            <p>
                Already have an account?{' '}
                <NavLink to="/login" >Sign in</NavLink>
            </p>  
        </div>
    );
}

export default Signup;
