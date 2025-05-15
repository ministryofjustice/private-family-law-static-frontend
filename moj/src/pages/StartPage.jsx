import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartPage.css';

const StartPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/risk-assessment'); // Navigate to the risk assessment page
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l">Make child arrangements</h1>
        
        <p className="govuk-body-l">
          You can choose how to make arragments for looking after your children if you separate from your partner.
        </p>
        
        <p className="govuk-body">
          What you can do is different in {' '}
          <a 
            href="https://www.mygov.scot/support-after-separation"
            className="govuk-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Scotland
          </a> and {' '}
          <a 
            href="https://www.nidirect.gov.uk/information-and-services/going-court/family-courts"
            className="govuk-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Northern Ireland
          </a>.
        </p>
        
        <p className="govuk-body">You and your ex-partner can usually avoid going to court hearings if you agree on:</p>
        
        <ul className="govuk-list govuk-list--bullet">
          <li>where the children will live</li>
          <li>how much time they will spend with each parent</li>
          <li>how you will financially support your children</li>
        </ul>

        <p className="govuk-body">You can use a legal advisor if you want to {' '}
          <a 
            href="https://www.gov.uk/arrange-child-maintenance-yourself/if-you-agree"
            className="govuk-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            make your agreement legally binding
          </a>.</p>

          <p className="govuk-body">You can {' '}
          <a 
            href="https://www.gov.uk/child-maintenance-service"
            className="govuk-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            agree on child maintenance
          </a> at the same time or separately.</p>
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