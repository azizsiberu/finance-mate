import React from 'react';
import { Box, Container, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import finmateLogo from '../assets/finance-mate-logo.webp';
import { useNeoBrutalism } from '../themes/useNeoBrutalism';
import { PageContainer, FloatingContainer, CoupleIllustration } from '../themes/layoutComponents';

const Homepage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  // Menggunakan komponen dari useNeoBrutalism
  const {
    DecorativeHeart,
    DecorativeCoin,
    DecorativeObject,
    BubbleSpeech,
    Paper: NeoBrutalistPaper,
    Button: NeoBrutalistButton,
    Title: NeoBrutalistTitle,
    Subtitle: NeoBrutalistSubtitle,
    FeatureBox: NeoBrutalistFeatureBox,
    FeatureTitle: NeoBrutalistFeatureTitle,
    LogoContainer,
    JourneyStep,
    CallToAction,
    animations
  } = useNeoBrutalism();

  return (
    <PageContainer>
      {/* Decorative elements */}
      <DecorativeHeart size="40px" left="5%" top="10%" delay={0.2} />
      <DecorativeHeart size="30px" left="12%" top="25%" delay={0.7} />
      <DecorativeHeart size="35px" left="85%" top="30%" delay={1.2} />
      <DecorativeHeart size="25px" left="75%" top="15%" delay={0.5} />
      
      <DecorativeCoin size="30px" left="20%" top="50%" delay={0.3} />
      <DecorativeCoin size="35px" left="80%" top="60%" delay={0.8} />
      <DecorativeCoin size="25px" left="30%" top="80%" delay={1.5} />
      
      <DecorativeObject emoji="💍" left="8%" top="40%" size="35px" animationDelay={0} />
      <DecorativeObject emoji="🏠" left="85%" top="75%" size="40px" animationDelay={0.5} />
      <DecorativeObject emoji="✈️" left="15%" top="70%" size="30px" animationDelay={1} />
      <DecorativeObject emoji="👶" left="90%" top="20%" size="30px" animationDelay={1.5} />
      <DecorativeObject emoji="🛒" left="20%" top="15%" size="25px" animationDelay={2} />
      
      {/* Couple illustration */}
      {isDesktop && (
        <CoupleIllustration>
          <BubbleSpeech>Ayo kelola keuangan bersama!</BubbleSpeech>
          <span style={{ fontSize: '100px' }}>👩‍❤️‍👨</span>
        </CoupleIllustration>
      )}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          pt: 3
        }}>
          <FloatingContainer>
            <LogoContainer>
              <img 
                src={finmateLogo} 
                alt="Finance Mate Logo" 
                style={{ 
                  maxWidth: isDesktop ? '220px' : isMobile ? '160px' : '180px',
                  height: 'auto'
                }} 
              />
            </LogoContainer>
            
            <NeoBrutalistTitle variant="h1">
              Finance Mate
            </NeoBrutalistTitle>
            
            <NeoBrutalistSubtitle variant="h2">
              Financial freedom for young couples
            </NeoBrutalistSubtitle>
          </FloatingContainer>
          
          <Grid container  justifyContent="center" sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ p: 2 }}>
              <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                <NeoBrutalistButton 
                  variant="contained" 
                  fullWidth
                >
                  Login
                </NeoBrutalistButton>
              </RouterLink>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ p: 2 }}>
              <RouterLink to="/signup" style={{ textDecoration: 'none' }}>
                <NeoBrutalistButton 
                  variant="contained" 
                  fullWidth
                  sx={{
                    backgroundColor: '#fff9c4',
                    '&:hover': {
                      backgroundColor: '#fff9c4',
                    }
                  }}
                >
                  Daftar
                </NeoBrutalistButton>
              </RouterLink>
            </Grid>
            
          </Grid>
          
          <NeoBrutalistPaper>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              mb: 4,
              textTransform: 'uppercase',
              textShadow: '3px 3px 0px #ff45a0',
              position: 'relative',
              display: 'inline-block',
            }}>
              Build Your Future Together
              <Box 
                component="span" 
                sx={{ 
                  position: 'absolute', 
                  top: '-20px', 
                  right: '-30px', 
                  fontSize: '30px', 
                  animation: `${animations.heartBeat} 2s infinite 0.5s` 
                }}
              >
                💞
              </Box>
            </Typography>
            
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 4 }} sx={{ p: 2 }}>
                <NeoBrutalistFeatureBox>
                  <Box sx={{ position: 'relative' }}>
                    <NeoBrutalistFeatureTitle>
                      Share Expenses
                    </NeoBrutalistFeatureTitle>
                    <Box 
                      component="span" 
                      sx={{ 
                        position: 'absolute', 
                        top: '-10px', 
                        right: '-15px', 
                        fontSize: '25px', 
                        transform: 'rotate(15deg)' 
                      }}
                    >
                      💸
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Track joint spending and split bills easily. Perfect for newlyweds and cohabiting couples managing shared finances.
                  </Typography>
                  <Box sx={{ mt: 2, fontSize: '24px', display: 'flex', justifyContent: 'center' }}>
                    <span>👫</span>
                  </Box>
                </NeoBrutalistFeatureBox>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }} sx={{ p: 2 }}>
                <NeoBrutalistFeatureBox sx={{ transform: isDesktop ? 'rotate(1deg)' : 'none' }}>
                  <Box sx={{ position: 'relative' }}>
                    <NeoBrutalistFeatureTitle>
                      Couple Budgeting
                    </NeoBrutalistFeatureTitle>
                    <Box 
                      component="span" 
                      sx={{ 
                        position: 'absolute', 
                        top: '-10px', 
                        right: '-15px', 
                        fontSize: '25px', 
                        transform: 'rotate(-10deg)' 
                      }}
                    >
                      📊
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Create household budgets together and receive alerts when approaching limits. Save for your first home or dream vacation!
                  </Typography>
                  <Box sx={{ mt: 2, fontSize: '24px', display: 'flex', justifyContent: 'center' }}>
                    <span>🏠✈️</span>
                  </Box>
                </NeoBrutalistFeatureBox>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }} sx={{ p: 2 }}>
                <NeoBrutalistFeatureBox sx={{ transform: isDesktop ? 'rotate(-1deg)' : 'none' }}>
                  <Box sx={{ position: 'relative' }}>
                    <NeoBrutalistFeatureTitle>
                      Relationship Goals
                    </NeoBrutalistFeatureTitle>
                    <Box 
                      component="span" 
                      sx={{ 
                        position: 'absolute', 
                        top: '-10px', 
                        right: '-15px', 
                        fontSize: '25px', 
                        transform: 'rotate(5deg)' 
                      }}
                    >
                      🎯
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Set financial milestones together - from wedding funds to family planning. Track your progress as a team.
                  </Typography>
                  <Box sx={{ mt: 2, fontSize: '24px', display: 'flex', justifyContent: 'center' }}>
                    <span>💍👶</span>
                  </Box>
                </NeoBrutalistFeatureBox>
              </Grid>
            </Grid>
            
            <Box 
              sx={{ 
                mt: 5, 
                transform: 'rotate(-2deg)',
                position: 'relative',
                '&:after': {
                  content: '"👇"',
                  position: 'absolute',
                  fontSize: '30px',
                  bottom: '-40px',
                  left: '50%',
                  marginLeft: '-15px',
                  animation: `${animations.moveAround} 2s infinite ease-in-out`
                }
              }}
            >
              <CallToAction variant="h6">
                Start your couple's financial journey today!
              </CallToAction>
            </Box>
            
            {/* Couple journey illustration */}
            <Grid container spacing={1} sx={{ mt: 8 }} justifyContent="center">
              <Grid size={{ xs: 12, sm: 'auto' }}>
                <JourneyStep>
                  <span style={{ fontSize: '24px', marginRight: '8px' }}>💑</span> Dating
                </JourneyStep>
              </Grid>
              <Grid size={{ xs: 12, sm: 'auto' }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box component="span" sx={{ fontSize: '20px' }}>➡️</Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 'auto' }}>
                <JourneyStep>
                  <span style={{ fontSize: '24px', marginRight: '8px' }}>💍</span> Engaged
                </JourneyStep>
              </Grid>
              <Grid size={{ xs: 12, sm: 'auto' }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box component="span" sx={{ fontSize: '20px' }}>➡️</Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 'auto' }}>
                <JourneyStep>
                  <span style={{ fontSize: '24px', marginRight: '8px' }}>👰‍♀️🤵‍♂️</span> Married
                </JourneyStep>
              </Grid>
              <Grid size={{ xs: 12, sm: 'auto' }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box component="span" sx={{ fontSize: '20px' }}>➡️</Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 'auto' }}>
                <JourneyStep>
                  <span style={{ fontSize: '24px', marginRight: '8px' }}>🏠</span> Home
                </JourneyStep>
              </Grid>
              <Grid size={{ xs: 12, sm: 'auto' }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box component="span" sx={{ fontSize: '20px' }}>➡️</Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 'auto' }}>
                <JourneyStep>
                  <span style={{ fontSize: '24px', marginRight: '8px' }}>👶</span> Family
                </JourneyStep>
              </Grid>
            </Grid>
          </NeoBrutalistPaper>
        </Box>
        <Grid container  justifyContent="center" sx={{ mb: 6 }}>
            <Grid size={6} sx={{ p: 2 }}>
              <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                <NeoBrutalistButton 
                  variant="contained" 
                  fullWidth
                >
                  Login
                </NeoBrutalistButton>
              </RouterLink>
            </Grid>
            <Grid size={6} sx={{ p: 2 }}>
              <RouterLink to="/signup" style={{ textDecoration: 'none' }}>
                <NeoBrutalistButton 
                  variant="contained" 
                  fullWidth
                  sx={{
                    backgroundColor: '#fff9c4',
                    '&:hover': {
                      backgroundColor: '#fff9c4',
                    }
                  }}
                >
                  Daftar
                </NeoBrutalistButton>
              </RouterLink>
            </Grid>
            
          </Grid>
      </Container>
    </PageContainer>
  );
};

export default Homepage;