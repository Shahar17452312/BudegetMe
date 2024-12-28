import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function NavBar() {
  return (
    <>
      <AppBar position="fixed" style={{ backgroundColor: '#2c3e50'} }>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            BudgetMe
          </Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Edit profile</Button>
          <Button color="inherit">Contact</Button>
        </Toolbar>
      </AppBar>

      {/* הוספת margin-top לתוכן במידה והמסך קטן */}
      <div style={{ marginTop: '64px', paddingTop: '10px' }}>
        {/* התוכן של הדף */}
      </div>
    </>
  );
}

export default NavBar;
