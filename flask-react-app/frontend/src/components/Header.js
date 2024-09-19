import React from 'react';

const Header = () => {
  return (
    <header className="app-header">
      <h1>魔術日記</h1>
      <nav>
        <ul>
          <li><a href="/">ホーム</a></li>
          <li><a href="/new">新規作成</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;