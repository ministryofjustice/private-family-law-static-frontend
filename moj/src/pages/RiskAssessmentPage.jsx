import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RiskAssessmentPage.css';

const RiskAssessmentPage = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleContinue = () => {
    if (selectedOption) {
      // Navigate to next page based on selection
      if (selectedOption === 'yes') {
        navigate('/urgent-proceedings'); // Or wherever 'Yes' should lead
      } else {
        navigate('/child-arrangement-options'); // Or wherever 'No' should lead
      }
    }
  };

  const statements = [
    "There is a risk of harm to the children involved, such as abduction.",
    "There is a risk to life or home.",
    "The child or applicant has been a victim of domestic abuse.",
    "The applicant has a disability.",
    "One of the people involved is in prison or has bail conditions, such as a restraining order.",
    "One or both parties do not live in England or Wales.",
    "A child protection plan is in place.",
    "A local authority is carrying out an active investigation.",
    "This is an urgent application.",
    "One or more of the applicants or respondents is under the age of 18.",
    "One or more of the children involved is subject to emergency proceedings, care proceedings, or supervision proceedings.",
    "A consent order is required."
  ];

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <button 
          className="govuk-back-link" 
          onClick={handleBack}
        >
          Back
        </button>

        <h1 className="govuk-heading-l">
          Do one or more of these statements apply to you?
        </h1>

        <ul className="govuk-list govuk-list--bullet">
          {statements.map((statement, index) => (
            <li key={index} className="govuk-body">{statement}</li>
          ))}
        </ul>

        <div className="govuk-form-group">
          <div className="govuk-radios">
            <div className="govuk-radios__item">
              <input 
                className="govuk-radios__input" 
                id="yes" 
                name="risk-assessment" 
                type="radio" 
                value="yes"
                checked={selectedOption === 'yes'}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label className="govuk-label govuk-radios__label" htmlFor="yes">
                Yes
              </label>
            </div>
            <div className="govuk-radios__item">
              <input 
                className="govuk-radios__input" 
                id="no" 
                name="risk-assessment" 
                type="radio" 
                value="no"
                checked={selectedOption === 'no'}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label className="govuk-label govuk-radios__label" htmlFor="no">
                No
              </label>
            </div>
          </div>
        </div>

        <button 
          className="govuk-button" 
          onClick={handleContinue}
          disabled={!selectedOption}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RiskAssessmentPage;