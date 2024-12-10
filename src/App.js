import './App.css';
import { NavLink, Route, Routes } from 'react-router-dom';
import DayHappinessPrompt from './components/views/DayHappinessPrompt';
import HappinessStats from './components/views/HappinessStats';
import NavHome from './assets/nav-home.svg';
import NavStats from './assets/nav-stats.svg';
import NavInfo from './assets/nav-info.svg';
import AccountNavLink from './components/nav/AccountNavLink'
import Info from './components/views/Info';
import Signup from './components/views/Signup';
import Login from './components/views/Login';
import Logout from './components/views/Logout';
import { useState } from 'react';
import ErrorBanner from './components/ErrorBanner';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [errorMessage, setErrorMessage] = useState(null);

  const resetError = () => setErrorMessage(null);
  const setError = (msg) => setErrorMessage(msg);

  return (
    <div className="App flex-column">
      <nav className="flex-column-fixed flex-row">
        <NavLink to="/" className="nav-item"><img src={NavHome} alt='home'/></NavLink>
        <NavLink to="/stats" className="nav-item"><img src={NavStats} alt='stats'/></NavLink>
        <NavLink to="/info" className="nav-item"><img src={NavInfo} alt='info'/></NavLink>
        <AccountNavLink />
      </nav>
      <div className="flex-column-main">
        <ErrorBanner message={errorMessage} onClose={resetError}/>
        <Routes>
          <Route path="/info" element={<Info />}/>
          <Route path="/signup" element={<Signup onError={setError}/>} />
          <Route path="/login" element={<Login onError={setError}/>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={
            <PrivateRoute>
              <DayHappinessPrompt onError={setError}/>
            </PrivateRoute>
          }/>
          <Route path="/stats" element={
            <PrivateRoute>
              <HappinessStats/>
            </PrivateRoute>
          }/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
