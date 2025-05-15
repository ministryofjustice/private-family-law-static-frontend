import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChildArrangementOptions.css';

const ChildArrangementOptions = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');
  const [question, setQuestion] = useState('');
  
  // Feature flag - in a real app, this might come from an environment variable, 
  // context, or configuration file
  const featureFlag = 'dynamic'; // Change to 'static' to hide the benefits section

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleContinue = () => {
    if (selectedOption) {
      // Navigate to next page based on selection
      if (selectedOption === 'canMakePlan') {
        navigate('/create-plan'); // Route for creating their own plan
      } else {
        navigate('/find-mediator'); // Route for those who need help agreeing
      }
    }
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (question.trim()) {
      // Handle question submission
      console.log('Question submitted:', question);
      // You might want to send this to an API or store it in state management
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
            Which option is the most suitable based on your situation?
          </h1>

          <p className="govuk-body">
            The best solution for your Child is through an amicable arrangement between 
            yourself and your partner. This is called a Child Arrangement Plan.
          </p>

          <p className="govuk-body">
            A Child Arrangement Plan helps separated or divorced parents agree on their 
            child's care, including where the child lives, time spent with each parent, and 
            key decisions like education and health.
          </p>

          <p className="govuk-body">
            Parents with a cooperative relationship may create a plan themselves, but 
            professional support may be needed if they can't agree. The best approach 
            depends on how well parents communicate and the complexity of the 
            situation - amicable agreements save time and cost, while structured support 
            helps in more difficult cases.
          </p>

          <div className="govuk-form-group">
            <div className="govuk-radios">
              <div className="govuk-radios__item">
                <input 
                  className="govuk-radios__input" 
                  id="canMakePlan" 
                  name="arrangement-option" 
                  type="radio" 
                  value="canMakePlan"
                  checked={selectedOption === 'canMakePlan'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label className="govuk-label govuk-radios__label" htmlFor="canMakePlan">
                  We can make a Child Arrangement Plan
                </label>
              </div>
              <div className="govuk-radios__item">
                <input 
                  className="govuk-radios__input" 
                  id="needHelp" 
                  name="arrangement-option" 
                  type="radio" 
                  value="needHelp"
                  checked={selectedOption === 'needHelp'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label className="govuk-label govuk-radios__label" htmlFor="needHelp">
                  We will need help agreeing
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

        <div className="govuk-grid-column-one-third">
          <div className="sidebar-help">
            <h2 className="govuk-heading-m">How can I assist you?</h2>
            
            <form onSubmit={handleSubmitQuestion}>
              <div className="govuk-form-group">
                <label className="govuk-label" htmlFor="question">
                  <span className="govuk-visually-hidden">Enter your question</span>
                </label>
                <textarea
                  className="govuk-textarea"
                  id="question"
                  name="question"
                  rows="5"
                  placeholder="Enter your question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="govuk-button govuk-button--secondary">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildArrangementOptions;