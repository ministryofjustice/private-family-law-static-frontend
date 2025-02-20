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

export default function FileList() {
  const [value, setValue] = React.useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const navigate = useNavigate(); // hook to navigate programmatically

  const handleButtonClick = () => {
    // Navigate to Case summary page
    navigate('/case-summary');
  };

  return (
    <>
    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
    <div className="mb-3">
      <a href="/check-file" >&lt; Back</a>
    </div>
    </Grid>

    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 8}}>
        <div class="checkFileWrapper">
          <h2 className='mb-4'>Upload files</h2>
          
          <h3 className='mb-2'>Files added</h3>
          <ul className="fileList">
            <li>
              <div className="fileDetails">
                <h4>File 1</h4>
                <p className="fileDetails">
                  <span className="fileName">
                    <span>case.pdf</span> 
                    <span>, </span>
                  </span>
                  <span class="fileSize">2MB</span>
                </p>
                <p className='action'>
                  <a href="">Delete</a>
                </p>
              </div>
            </li>
            <li>
              <div className="fileDetails">
                <h4>File 2</h4>
                <p className="fileDetails">
                  <span className="fileName">
                    <span>receipt.pdf</span> 
                    <span>, </span>
                  </span>
                  <span class="fileSize">3MB</span>
                </p>
                <p className='action'>
                  <a href="">Delete</a>
                </p>
              </div>
            </li>
          </ul>

          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">Do you want to upload another file?</FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel value="female" control={<Radio />} label="Yes" />
              <FormControlLabel value="male" control={<Radio />} label="No" />
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