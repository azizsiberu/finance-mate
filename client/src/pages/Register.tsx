import React, { useState, useEffect } from 'react';
import { Typography, Box, useMediaQuery, useTheme, Alert, CircularProgress, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PageContainer } from '../themes/layoutComponents';
import { useNeoBrutalism } from '../themes/useNeoBrutalism';
import { neoBrutalismColors } from '../themes/neobrutalism';

const Register: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  
  // Menggunakan neobrutalism hook untuk mendapatkan komponen
  const { Paper, Button, Title } = useNeoBrutalism();
  
  // Menggunakan auth context
  const { register, isAuthenticated, loading, error, clearError } = useAuth();
  
  // State untuk form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Redirect ke homepage jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Validasi form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Validasi first name
    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    // Validasi email
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    // Validasi password
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Validasi confirm password
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle register form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Validasi form
    if (!validateForm()) {
      return;
    }
    
    // Call register function dari auth context
    await register(firstName, email, password, lastName);
  };
  
  // Handle navigate to login page
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  // Styling untuk text fields
  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '0px',
      border: `3px solid ${neoBrutalismColors.dark}`,
      backgroundColor: neoBrutalismColors.primaryLight,
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
        fontSize: '1.1rem',
        fontWeight: 'bold',
        [theme.breakpoints.down('md')]: {
          padding: '15px',
          fontSize: '1rem',
        },
        [theme.breakpoints.down('sm')]: {
          padding: '12px',
          fontSize: '0.95rem',
          border: `2px solid ${neoBrutalismColors.dark}`,
        },
      }
    },
    '& .MuiInputLabel-root': {
      fontWeight: 'bold',
      color: 'black',
      fontSize: '1.1rem',
      marginLeft: '5px',
      marginTop: '-5px',
      [theme.breakpoints.down('md')]: {
        fontSize: '1rem',
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.95rem',
      },
    },
    marginBottom: '20px',
    [theme.breakpoints.down('md')]: {
      marginBottom: '18px',
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: '16px',
    },
  };
  
  return (
    <PageContainer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90vh',
        }}
      >
        <Paper
          sx={{
            width: '100%',
            maxWidth: isDesktop ? '700px' : isMobile ? '100%' : '550px',
            mx: 'auto',
          }}
        >
          {/* Logo Section - Desktop Only */}
          {isDesktop && (
            <Box 
              sx={{ 
                position: 'absolute',
                top: '-25px',
                right: '-25px',
                width: '100px',
                height: '100px',
                backgroundColor: neoBrutalismColors.accent,
                border: `4px solid ${neoBrutalismColors.dark}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: `5px 5px 0px 0px ${neoBrutalismColors.dark}`,
                transform: 'rotate(5deg)',
              }}
            >
              <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>FINMATE</Typography>
            </Box>
          )}
          
          {/* Title Section */}
          <Box mb={isDesktop ? 4 : isMobile ? 2 : 3} mt={isDesktop ? 3 : isMobile ? 1 : 2}>
            <Title variant="h1">Register</Title>
          </Box>
          
          {/* Error Alert */}
          {error && (
            <Box mb={3}>
              <Alert 
                severity="error" 
                onClose={clearError}
                sx={{ 
                  border: `2px solid ${neoBrutalismColors.dark}`,
                  borderRadius: '0',
                  fontWeight: 'bold'
                }}
              >
                {error}
              </Alert>
            </Box>
          )}
          
          {/* Form Section */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  margin="normal"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={formSubmitted && !!formErrors.firstName}
                  helperText={formSubmitted && formErrors.firstName}
                  sx={textFieldSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name (Optional)"
                  variant="outlined"
                  margin="normal"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  sx={textFieldSx}
                />
              </Grid>
            </Grid>
            
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={formSubmitted && !!formErrors.email}
              helperText={formSubmitted && formErrors.email}
              sx={textFieldSx}
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={formSubmitted && !!formErrors.password}
              helperText={formSubmitted && formErrors.password}
              sx={textFieldSx}
            />
            
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={formSubmitted && !!formErrors.confirmPassword}
              helperText={formSubmitted && formErrors.confirmPassword}
              sx={textFieldSx}
            />
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
            </Button>
          </form>
          
          {/* Sign In Section */}
          <Box mt={isDesktop ? 4 : isMobile ? 3 : 3.5} sx={{ transform: isMobile ? 'rotate(0deg)' : 'rotate(1deg)' }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: isDesktop ? '1.1rem' : isMobile ? '0.95rem' : '1rem',
                backgroundColor: neoBrutalismColors.accent,
                padding: isDesktop ? '10px' : isMobile ? '8px' : '10px',
                display: 'inline-block',
                border: isDesktop ? `3px solid ${neoBrutalismColors.dark}` : `2px solid ${neoBrutalismColors.dark}`
              }}
            >
              Already have an account? <span 
                style={{ color: neoBrutalismColors.primary, textDecoration: 'underline', cursor: 'pointer' }}
                onClick={handleLoginClick}
              >Sign In</span>
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
                  backgroundColor: neoBrutalismColors.accent,
                  border: `2px solid ${neoBrutalismColors.dark}`,
                  display: 'inline-flex',
                  boxShadow: `3px 3px 0px 0px ${neoBrutalismColors.dark}`,
                }}
              >
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>FINMATE</Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </PageContainer>
  );
};

export default Register;