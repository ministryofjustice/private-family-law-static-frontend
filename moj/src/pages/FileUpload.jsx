import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import GoBackButton from '../components/GoBackButton';
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
    navigate('/dashboard');
  };

  return (
    <>
      <GoBackButton />
      
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <div className='container'>
            <h2>Your account</h2>
            <p>You can use our new AI dashboard to find information about your case. By uploading your case file, our AI tool will generate a comprehensive case summary, featuring information from similar cases that match your file.</p>
            <p>Additionally, you can find your action list, submitted documents, and support tools. The AI Q&A tool is also available to assist with any questions you may have.</p>
            
            <h3 className='mt-3'>Upload your file</h3>
            <p>You can upload your file here</p>

            <Button className="btn-upload cta-button"
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Choose file
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                multiple
              />
            </Button>
            <div>
              <Button onClick={handleButtonClick} variant="contained" color="success" className='mt-4 cta-button'>
                Continue
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
}