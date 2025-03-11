import { useNavigate, useParams } from 'react-router-dom';
import './GoBackButton.css';

const GoBackButton = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();

  const handleGoBack = () => {
    // Check if we're in a service page and have a case ID
    if (window.location.pathname.includes('/service/') && caseId) {
      // Navigate directly to the dashboard with the case ID
      navigate(`/dashboard/${caseId}`);
    } else {
      // Otherwise use standard back navigation
      navigate(-1);
    }
  };

  return (
    <button className="backBtn" onClick={handleGoBack}>&lt; Back</button>
  );
};

export default GoBackButton;