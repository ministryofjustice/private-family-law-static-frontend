import Grid from '@mui/material/Grid2';
import '../App.css';

export default function Home() {
  
 return (
    <>
    <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <div>
            <h2>Your account</h2>
            <ul>
              <li>
                <div>
                  <a href="file-upload">Upload your file</a>
                  <p>Instantly generate an AI-powered journey and case summary, featuring information from similar cases that match your file.</p>
                </div>
              </li>
              <li><a href="">View submitted documents</a></li>
              <li><a href="">View activity planner</a></li>
            </ul>
          </div>
          <div className='mt-4'>
            <h3>Support tools</h3>
            <ul>
              <li><a href="">Parent planner</a></li>
              <li><a href="">Finance planner</a></li>
              <li><a href="">Benefits</a></li>
              <li><a href="">Advice finder</a></li>
              <li><a href="">Homes and assets</a></li>
              <li><a href="">Find a representative</a></li>
              <li><a href="">Mental health</a></li>
              <li><a href="">Voice of the child</a></li>
            </ul>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
