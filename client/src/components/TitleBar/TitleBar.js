// src/components/TitleBar/TitleBar.jsx
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const TitleBar = ({ toggleDrawer, drawerOpen }) => {
  return (
    <AppBar 
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={toggleDrawer}
          edge="start"
          sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Wyser Reports
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TitleBar;