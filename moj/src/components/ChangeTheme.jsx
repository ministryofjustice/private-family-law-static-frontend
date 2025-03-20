import React, { useState, useEffect } from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import './ChangeTheme.css';

const ToggleClassSwitch = () => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Add or remove class from <body> when `isChecked` changes
    if (isChecked) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    
    // Cleanup on component unmount to avoid memory leaks
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, [isChecked]);

  const handleSwitchChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <div className="themeSwitch inner-container">
      <FormControlLabel
        control={
          <Switch
            checked={isChecked}
            onChange={handleSwitchChange}
            name="toggleClassSwitch"
            color="primary"
          />
        }
        label="Light Theme"
      />
    </div>
  );
};

export default ToggleClassSwitch;