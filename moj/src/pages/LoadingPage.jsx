import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import analysingFile from "../assets/analysing-file.gif";

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate a 2-second loading time
    setTimeout(() => {
      navigate("/dashboard"); // After the delay, navigate to page three
    }, 3000);
  }, [navigate]);

  return (
    <div className="loadingPage">
      <div>
        <h2>Analysing files...</h2>
        <img src={analysingFile} className='logo' alt="Analysing file loader" />
        <h3 className="mediumText">We are generating the next steps for you.</h3>
      </div>
    </div>
  );
};

export default LoadingPage;
