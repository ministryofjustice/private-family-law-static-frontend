import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import Header from './components/Header';
import CalculateBenefitsPage from './pages/CalculateBenefitsPage';
import RiskAssessmentPage from './pages/RiskAssessmentPage';
import ChildArrangementOptions from './pages/ChildArrangementOptions';
import FindMediator from './pages/FindMediator';
import './App.css';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlFlag = urlParams.get('benefitsFeature');
  const localStorageFlag = localStorage.getItem('benefitsFeatureFlag');
  const envFlag = import.meta.env.VITE_BENEFITS_FEATURE || 'static';

  const benefitsFeatureFlag = urlFlag || localStorageFlag || envFlag;

  // Expose a function to window for console access
  window.setBenefitsFeature = (value) => {
    if (value === 'dynamic' || value === 'static') {
      localStorage.setItem('benefitsFeatureFlag', value);
      window.location.reload();
    } else {
      console.error('Invalid value. Use "dynamic" or "static"');
    }
  };
  
  // Also allow clearing
  window.clearBenefitsFeature = () => {
    localStorage.removeItem('benefitsFeatureFlag');
    window.location.reload();
  };
  return (
    <Router>
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content" role="main">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
            <Route path="/child-arrangement-options" element={<ChildArrangementOptions/>} />
            <Route path="/find-mediator" element={<FindMediator  benefitsFeatureFlag={benefitsFeatureFlag}/>} />
            <Route path="/calculate-benefits" element={<CalculateBenefitsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;