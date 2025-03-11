import { useNavigate, useLocation } from 'react-router-dom';
import './GoBackButton.css';

const GoBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    // List of routes that should navigate to home
    const routesToHome = ['/file-upload', '/dashboard'];
    
    if (routesToHome.includes(location.pathname)) {
      navigate('/home');
    } else {
      navigate(-1); // Go back one step in history
    }
  };

  return (
    <button className="backBtn" onClick={handleGoBack}>&lt; Back</button>
  );
};

export default GoBackButton;