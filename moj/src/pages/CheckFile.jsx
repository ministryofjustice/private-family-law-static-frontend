import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import thumbnail from "../assets/file-thumbnail.png"

export default function CheckFile() {
  const [value, setValue] = React.useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const navigate = useNavigate(); // hook to navigate programmatically

  const handleButtonClick = () => {
    // Navigate to Case summary page
    navigate('/file-list');
  };

  return (
    <>
    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
    <div className="mb-3">
      <a href="/file-upload" >&lt; Back</a>
    </div>
    </Grid>

    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <div class="checkFileWrapper">
          <h2>Check file</h2>

          <div className="fileThumbnail mb-4">
            <img src={thumbnail} className='thumbnail' alt="File thumbnail" />
            <p className="fileDetails">
              <span className="fileName">
                <span>case.pdf</span> 
                <span>, </span>
              </span>
              <span class="fileSize">2MB</span>
            </p>
          </div>

          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">Is this file correct?</FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel value="female" control={<Radio />} label="Yes, use this file" />
              <FormControlLabel value="male" control={<Radio />} label="No, I want to choose a different file" />
            </RadioGroup>
          </FormControl>
        </div>

        <Button onClick={handleButtonClick} variant="contained" color="success" className='mt-4 cta-button'>
          Continue
        </Button>

      </Grid>
    </Grid>
    </>
  );
}