import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';


import '../App.css';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function FileUpload() {
  const navigate = useNavigate(); // hook to navigate programmatically

  const handleButtonClick = () => {
    // Navigate to Check file page
    navigate('/check-file');
  };

  return (
    <>
    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
      <div className="mb-3">
        <a href="/" >&lt; Back</a>
      </div>
    </Grid>

    <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <div>
            <h2>Upload file</h2>
            <p>You can upload your file here</p>

            <Button className="btn-upload cta-button"
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
          >
            Choose file
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => console.log(event.target.files)}
              multiple
            />
          </Button>
          </div>
          <Button onClick={handleButtonClick} variant="contained" color="success" className='mt-4 cta-button'>
            Continue
          </Button>

        </Grid>
      </Grid>
    </>
  );
}