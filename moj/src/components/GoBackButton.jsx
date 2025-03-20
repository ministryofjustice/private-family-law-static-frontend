import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './GoBackButton.css';

const GoBackButton = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const location = useLocation();
  
  // List of base routes that should navigate to home
  const routesToHome = ['/file-upload', '/case-details'];

  const handleGoBack = () => {
    // Check if we're in a service page and have a case ID
    if (location.pathname.includes('/service/') && caseId) {
      // Navigate directly to the dashboard with the case ID
      navigate(`/case-details/${caseId}`);
    } else {
      // Check if current path matches any routesToHome base path
      const isRouteToHome = routesToHome.some(route => 
        location.pathname.startsWith(route)
      );

      if (isRouteToHome) {
        navigate('/home');
      } else {
        // Otherwise use standard back navigation
        navigate(-1);
      }
    }
  };

  return (
    <button className="backBtn" onClick={handleGoBack}>&lt; Back</button>
  );
};

export default GoBackButton;