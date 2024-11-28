import './App.css';
import { NavLink, Route, Routes } from 'react-router-dom';
import AppRoute from './components/AppRoute';
import DayHappinessPrompt from './components/DayHappinessPrompt';
import HappinessStats from './components/HappinessStats';
import NavHome from './assets/nav-home.svg';
import NavStats from './assets/nav-stats.svg';
import NavInfo from './assets/nav-info.svg';
import AccountNavLink from './components/AccountNavLink'
import Info from './components/Info';
import Signup from './components/Signup';
import Login from './components/Login';
import Logout from './components/Logout';
import { useState } from 'react';
import ErrorBanner from './components/ErrorBanner';

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
          <Route element={<AppRoute />}>
            <Route path="/info" element={<Info />}/>
          </Route>
          <Route element={<AppRoute infoRequired={true}/>}>
            <Route path="/signup" element={<Signup onError={setError}/>} />
            <Route path="/login" element={<Login onError={setError}/>} />
            <Route path="/logout" element={<Logout />} />
          </Route>
          <Route element={<AppRoute infoRequired={true} authRequired={true}/>}>
            <Route path="/" element={<DayHappinessPrompt />} />
            <Route path="/stats" element={<HappinessStats />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
