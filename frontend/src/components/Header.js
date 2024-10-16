import React from 'react';
import './Header.css';

const Header = ({ onHomeClick, onNewDiaryClick }) => {
  return (
    <header className="app-header">
      <h1>魔術日記</h1>
      <nav>
        <ul>
          <li><button onClick={onHomeClick}>ホーム</button></li>
          <li><button onClick={onNewDiaryClick}>新規作成</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;