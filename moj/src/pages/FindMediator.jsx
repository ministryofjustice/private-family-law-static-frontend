import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindMediator.css';

const FindMediator = ({ benefitsFeatureFlag = 'static' }) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');
  const [question, setQuestion] = useState('');

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    if (selectedOption) {
      if (selectedOption === 'mediator') {
        navigate('/mediator-info');
      } else if (selectedOption === 'solicitor') {
        navigate('/solicitor-info');
      }
    }
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (question.trim()) {
      console.log('Question submitted:', question);
    }
  };

  return (
    <div className="govuk-width-container">
      <button 
        className="govuk-back-link" 
        onClick={handleBack}
      >
        Back
      </button>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l">
            Find a mediator or solicitor
          </h1>

          <p className="govuk-body">
            You can seek help either through an independent organisation who can assist
            you with these neogtiations. These are called Mediators or Lawyer led mediation.
            {' '}
          <a 
            href="https://www.gov.uk/guidance/family-mediation-voucher-scheme"
            className="govuk-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            If you opt for a Mediator, who is accredited to the Family Mediation Council, you will
            automatically qualify for a £500 voucher to help with the cost of mediation.
          </a> Lawyer Led mediation is private and costs vary. You can find out more about
            cost using our support tools and we can connect you to the right people if this is your preferred
            option.
          </p>

          <p className="govuk-body-l"> <strong>
            {' '}
          <a 
            href="https://www.familymediationcouncil.org.uk/find-local-mediator/"
            className="govuk-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Find a family mediator
          </a> </strong>
          </p>

          <p className="govuk-body">
            Mediation sessions are run by profressionals who help you try to reach an agreement without going to court.
            It isn't relationship counselling and you don't have to be in the same room as the other parent.
          </p>

          <p className="govuk-body">
            <strong>Choose Professional mediation if...</strong> <br /> You both want to reach an agreement but need help from someone
            who is independent.
          </p>

          <p className="govuk-body">
            <strong>Who's involved in Professional mediation</strong> <br /> 
            <ul className="govuk-list govuk-list--bullet">
              <li>Both parents</li>
              <li>Mediator</li>
            </ul>
          </p>

          <h3 className="govuk-heading-s">Pros</h3>
          <ul className="govuk-list govuk-list--bullet">
            <li>It is quicker than court in most cases</li>
            <li>Can be cheaper than using a solicitor</li>
            <li>Less conflict between parents</li>
            <li>Helps children continue family relationships</li>
            <li>Agreements are flexible</li>
          </ul>

          <h3 className="govuk-heading-s">Cons</h3>
          <ul className="govuk-list govuk-list--bullet">
            <li>You'll need a consent order to make agreement legally binding</li>
            <li>Process won't work unless parents can cooperate</li>
          </ul>

          <p className="govuk-body-l"> <strong>
            {' '}
          <a 
            href="https://solicitors.lawsociety.org.uk/"
            className="govuk-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Find a Solicitor
          </a> </strong>
          </p>

          <p className="govuk-body">
            You don't have to deal directly with the other parent if you choose this option.
            You hire a solicitor to negotiate arrangements for you.
          </p>

          <p className="govuk-body">
            <strong>Choose Solicitor negotiation if...</strong> <br /> Your relationship is still difficult and you'd prefer not to meet,
            or there's a lack of trust.
          </p>

          <p className="govuk-body">
            <strong>Who's involved in Solicitor negotiation</strong> <br /> 
            <ul className="govuk-list govuk-list--bullet">
              <li>Solicitor for each parent</li>
            </ul>
          </p>

          <h3 className="govuk-heading-s">Pros</h3>
          <ul className="govuk-list govuk-list--bullet">
            <li>Your solicitor supports you throughout</li>
            <li>Quicker and less stressful than court</li>
            <li>You don't deal directly with the other parent</li>
          </ul>

          <h3 className="govuk-heading-s">Cons</h3>
          <ul className="govuk-list govuk-list--bullet">
            <li>Can be a more expensive process</li>
            <li>You may feel you're not in control</li>
            <li>Can be seen as a confrontational approach</li>
          </ul>
          <hr className="govuk-section-break govuk-section-break--xl govuk-section-break--visible"/>

          <h1 className="govuk-heading-l">Useful information </h1>


          <p className="govuk-body-l"> <strong>
            {' '}
          <a 
            href=""
            className="govuk-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ultimate guide to Family Mediation UK
          </a> </strong>
          </p>

          <p className="govuk-body">
            Lore impsum dolor sit amet, consectetur adipiscing elit.
          </p>
          
          {benefitsFeatureFlag === 'dynamic' && (
            <>
              <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible"/>
              
              <h2 className="govuk-heading-m">
                Financial support calculator
              </h2>
              
              <p className="govuk-body">
                If you're going through a separation or divorce, it's important to understand 
                what financial support you may be entitled to. Our benefits calculator can help 
                you estimate your potential take-home income, including Universal Credit, 
                housing benefits, and other support.
              </p>
              
              <p className="govuk-body">
                This can help you make informed decisions about child arrangements and ensure 
                you're receiving all the support you're eligible for during this transition.
              </p>
              
              <p className="govuk-body">
                <a 
                  href="/calculate-benefits" 
                  className="govuk-link govuk-link--no-visited-state"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/calculate-benefits');
                  }}
                >
                  Calculate your benefits
                </a>
              </p>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default FindMediator;