import { useNavigate } from 'react-router-dom';
import './GoBackButton.css';

const GoBackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This takes you back to the previous page in the browser history
  };

  return (
    <button className="backBtn" onClick={handleGoBack}>&lt; Back</button>
  );
};

export default GoBackButton;