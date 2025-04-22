import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNeoBrutalism } from './useNeoBrutalism';

// Layout containers dengan tema neobrutalism
export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  padding: '40px 20px',
  backgroundImage: 'linear-gradient(45deg, #ffd1e8 25%, #ffe3f1 25%, #ffe3f1 50%, #ffd1e8 50%, #ffd1e8 75%, #ffe3f1 75%, #ffe3f1 100%)',
  backgroundSize: '40px 40px',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: '20px 15px',
    backgroundSize: '30px 30px',
  },
}));

export const DarkPageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  padding: '40px 20px',
  backgroundImage: 'linear-gradient(45deg, #202020 25%, #303030 25%, #303030 50%, #202020 50%, #202020 75%, #303030 75%, #303030 100%)',
  backgroundSize: '40px 40px',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: '20px 15px',
    backgroundSize: '30px 30px',
  },
}));

// Container dengan animasi float
export const FloatingContainer = styled(Box)(({ theme }) => {
  const { animations } = useNeoBrutalism();
  
  return {
    position: 'relative',
    animation: `${animations.float} 4s infinite ease-in-out`,
    transformOrigin: 'center center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
  };
});

// Container untuk pasangan ilustrasi (seperti di homepage)
export const CoupleIllustration = styled(Box)(({ theme }) => {
  const { animations } = useNeoBrutalism();
  
  return {
    position: 'absolute',
    right: '-10px',
    top: '120px',
    fontSize: '70px',
    animation: `${animations.float} 5s infinite ease-in-out`,
    transformOrigin: 'center center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
    [theme.breakpoints.down('md')]: {
      fontSize: '50px',
      right: '-5px',
      top: '100px',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  };
});

// Dashboard content container
export const ContentContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fffaff',
  borderRadius: '0px',
  border: '3px solid black',
  padding: '25px',
  boxShadow: '8px 8px 0px 0px #000000',
  [theme.breakpoints.down('sm')]: {
    padding: '15px',
    boxShadow: '5px 5px 0px 0px #000000',
    border: '2px solid black',
  },
}));

// Card container untuk dashboard
export const InfoCard = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  border: '2px solid black',
  borderRadius: '0px',
  padding: '15px',
  height: '100%',
  boxShadow: '5px 5px 0px 0px #000000',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translate(-2px, -2px)',
    boxShadow: '7px 7px 0px 0px #000000',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
    boxShadow: '3px 3px 0px 0px #000000',
  },
}));

// Sidebar container
export const SidebarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffd1e8',
  border: '3px solid black',
  borderRadius: '0px',
  padding: '20px',
  height: '100%',
  boxShadow: '5px 5px 0px 0px #000000',
  [theme.breakpoints.down('sm')]: {
    padding: '15px',
    border: '2px solid black',
    boxShadow: '3px 3px 0px 0px #000000',
  },
}));

// Form container
export const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  border: '3px solid black',
  borderRadius: '0px',
  padding: '30px',
  boxShadow: '8px 8px 0px 0px #000000',
  maxWidth: '500px',
  width: '100%',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
    border: '2px solid black',
    boxShadow: '5px 5px 0px 0px #000000',
  },
}));

export default {
  PageContainer,
  DarkPageContainer,
  FloatingContainer,
  CoupleIllustration,
  ContentContainer,
  InfoCard,
  SidebarContainer,
  FormContainer
};