import React from 'react';
import Mascot from './Mascot.gif';
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  return (
    <header className="header">
      <div className="header-title-container">
        <img
          src={Mascot}
          alt="Butterfly Books Mascot"
          className="header-logo"
        />
        <h1>Butterfly Books</h1>
      </div>
      <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? <FaMoon /> : <IoSunny />}
      </button>
    </header>
  );
};

export default Header;