import React from 'react';
import logo from '../assets/logo-white.png';
import './Header.css';

const Header = () => {
  return (
    <header className="govuk-header" role="banner" data-module="govuk-header">
      <div className="govuk-header__container govuk-width-container">
        <div className="govuk-header__logo">
          <a href="/" className="govuk-header__link govuk-header__link--homepage">
            <img src={logo} alt="Ministry of Justice" className="govuk-header__logo-image" />
            <span className="govuk-header__product-name">
              Check what benefits you could get
            </span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;