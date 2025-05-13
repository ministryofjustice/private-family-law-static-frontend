import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartPage.css';

const StartPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/calculate-benefits');
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l">Check what benefits you could get</h1>
        
        <p className="govuk-body-l">
          Use this service to find out what benefits you might be eligible for.
        </p>
        
        <p className="govuk-body">
          This service will ask you some questions about your circumstances to help determine 
          which benefits you may be able to claim.
        </p>
        
        <p className="govuk-body">It takes around 5 minutes to complete.</p>
        
        <button 
          className="govuk-button govuk-button--start" 
          data-module="govuk-button"
          onClick={handleStart}
        >
          Start now
          <svg className="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StartPage;