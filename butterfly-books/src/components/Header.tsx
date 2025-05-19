import React from 'react';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  return (
    <header>
      <h1>Butterfly Books</h1>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        <span>{theme === 'light' ? '🌙 Dark' : '☀️ Light'} Mode</span>
      </button>
    </header>
  );
};

export default Header;