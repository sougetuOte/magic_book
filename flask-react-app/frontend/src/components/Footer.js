import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p>&copy; {currentYear} 魔術日記アプリケーション. All rights reserved.</p>
    </footer>
  );
};

export default Footer;