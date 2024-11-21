import './LoginSignup.css'
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Login({ onError }) {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = async (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                switch (error.code) {
                    case 'auth/invalid-email':
                    case 'auth/user-not-found':
                    case 'auth/missing-password':
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        onError("Invalid email or password.");
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
        <div className='login-main flex-column'>            
            <form className='login-form'>    

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
                    className="login-button"
                    onClick={onLogin}
                >
                    SIGN IN
                </button>
            </form>

            <p>
                Need an account?{' '}
                <NavLink to="/signup">Sign up</NavLink>
            </p>
        </div>
    );
}

export default Login;
