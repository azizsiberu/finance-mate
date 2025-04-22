import React from 'react';
import { Typography, Paper, Box, useMediaQuery, useTheme, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components with neobrutalism design
const LoginContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100%',
  padding: '20px',
  backgroundImage: 'linear-gradient(45deg, #ffd1e8 25%, #ffe3f1 25%, #ffe3f1 50%, #ffd1e8 50%, #ffd1e8 75%, #ffe3f1 75%, #ffe3f1 100%)',
  backgroundSize: '40px 40px',
  [theme.breakpoints.down('sm')]: {
    padding: '15px',
    backgroundSize: '30px 30px',
  },
}));

const NeoBrutalistPaper = styled(Paper)(({ theme }) => ({
  padding: '2.8rem',
  textAlign: 'center',
  backgroundColor: 'white',
  border: '4px solid black',
  borderRadius: '0px',
  boxShadow: '10px 10px 0px 0px #000000',
  position: 'relative',
  transform: 'rotate(-1deg)',
  width: '100%',
  maxWidth: '650px', // Larger default size for desktop
  [theme.breakpoints.up('lg')]: {
    maxWidth: '700px', // Even wider for large screens
    padding: '3.2rem',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '550px', // Medium screens
    boxShadow: '8px 8px 0px 0px #000000',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '1.8rem',
    transform: 'rotate(0deg)',
    boxShadow: '6px 6px 0px 0px #000000',
    maxWidth: '100%', // Full width on mobile
    border: '3px solid black',
  },
}));

const NeoBrutalistButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ff45a0',
  color: 'black',
  fontWeight: 'bold',
  borderRadius: '0px',
  border: '3px solid black',
  padding: '14px 20px',
  boxShadow: '6px 6px 0px 0px #000000',
  textTransform: 'uppercase',
  marginTop: '2.5rem',
  transition: 'all 0.2s ease',
  fontSize: '1.2rem',
  letterSpacing: '1.5px',
  '&:hover': {
    backgroundColor: '#ff45a0',
    boxShadow: '2px 2px 0px 0px #000000',
    transform: 'translate(3px, 3px)',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '1.1rem',
    padding: '12px 16px',
    marginTop: '2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
    padding: '10px 15px',
    boxShadow: '4px 4px 0px 0px #000000',
    marginTop: '1.5rem',
    border: '2px solid black',
  },
}));

const NeoBrutalistTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '0px',
    border: '3px solid black',
    backgroundColor: '#ffd1e8',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
    '& input': {
      padding: '16px',
      fontSize: '1.2rem',
      [theme.breakpoints.down('md')]: {
        padding: '15px',
        fontSize: '1.1rem',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '12px',
        fontSize: '1rem',
      },
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 'bold',
    color: 'black',
    fontSize: '1.2rem',
    marginLeft: '5px',
    marginTop: '-5px',
    [theme.breakpoints.down('md')]: {
      fontSize: '1.1rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  marginBottom: '30px',
  [theme.breakpoints.down('md')]: {
    marginBottom: '25px',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: '20px',
    '& .MuiOutlinedInput-root': {
      border: '2px solid black',
    },
  },
}));

const NeoBrutalistTitle = styled(Typography)(({ theme }) => ({
  color: '#ff45a0',
  fontWeight: 900,
  fontSize: '3.5rem',
  textTransform: 'uppercase',
  textShadow: '5px 5px 0px black',
  marginBottom: '2.5rem',
  transform: 'rotate(-2deg)',
  display: 'inline-block',
  letterSpacing: '3px',
  [theme.breakpoints.down('md')]: {
    fontSize: '3rem',
    textShadow: '4px 4px 0px black',
    marginBottom: '2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
    textShadow: '3px 3px 0px black',
    marginBottom: '1.5rem',
    transform: 'rotate(-1deg)',
  },
}));

const Login: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <LoginContainer>
      <NeoBrutalistPaper>
        {/* Logo Section - Desktop Only */}
        {isDesktop && (
          <Box 
            sx={{ 
              position: 'absolute',
              top: '-25px',
              right: '-25px',
              width: '100px',
              height: '100px',
              backgroundColor: '#fff9c4',
              border: '4px solid black',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '5px 5px 0px 0px #000000',
              transform: 'rotate(5deg)',
            }}
          >
            <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>FINMATE</Typography>
          </Box>
        )}
        
        {/* Title Section */}
        <Box mb={isDesktop ? 6 : isMobile ? 3 : 5} mt={isDesktop ? 3 : isMobile ? 1 : 2}>
          <NeoBrutalistTitle variant="h1">
            Login
          </NeoBrutalistTitle>
        </Box>
        
        {/* Form Section */}
        <form>
          <NeoBrutalistTextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            InputProps={{ style: { fontWeight: 'bold' } }}
          />
          
          <NeoBrutalistTextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            InputProps={{ style: { fontWeight: 'bold' } }}
          />
          
          <NeoBrutalistButton
            fullWidth
            variant="contained"
            size="large"
          >
            Login
          </NeoBrutalistButton>
        </form>
        
        {/* Sign Up Section */}
        <Box mt={isDesktop ? 5 : isMobile ? 3 : 4} sx={{ transform: isMobile ? 'rotate(0deg)' : 'rotate(1deg)' }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: isDesktop ? '1.2rem' : isMobile ? '1rem' : '1.1rem',
              backgroundColor: '#fff9c4',
              padding: isDesktop ? '12px' : isMobile ? '8px' : '10px',
              display: 'inline-block',
              border: isDesktop ? '3px solid black' : '2px solid black'
            }}
          >
            Don't have an account? <span style={{ color: '#ff45a0', textDecoration: 'underline', cursor: 'pointer' }}>Sign Up</span>
          </Typography>
        </Box>
        
        {/* Mobile Logo - Mobile Only */}
        {isMobile && (
          <Box 
            mt={4}
            sx={{ 
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box 
              sx={{ 
                padding: '5px 15px',
                backgroundColor: '#fff9c4',
                border: '2px solid black',
                display: 'inline-flex',
                boxShadow: '3px 3px 0px 0px #000000',
              }}
            >
              <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>FINMATE</Typography>
            </Box>
          </Box>
        )}
      </NeoBrutalistPaper>
    </LoginContainer>
  );
};

export default Login;