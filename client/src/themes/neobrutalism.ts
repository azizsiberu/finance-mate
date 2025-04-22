import { keyframes } from '@mui/material/styles';

// Animation keyframes
export const keyframesAnimations = {
  float: keyframes`
    0% { transform: translateY(0px) rotate(-2deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
    100% { transform: translateY(0px) rotate(-2deg); }
  `,
  
  heartBeat: keyframes`
    0% { transform: scale(1); }
    10% { transform: scale(1.1); }
    20% { transform: scale(1); }
    30% { transform: scale(1.1); }
    40% { transform: scale(1); }
    100% { transform: scale(1); }
  `,
  
  coinDrop: keyframes`
    0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(0) rotate(360deg); opacity: 1; }
  `,
  
  moveAround: keyframes`
    0% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(10px, 5px) rotate(5deg); }
    50% { transform: translate(0, 10px) rotate(0deg); }
    75% { transform: translate(-10px, 5px) rotate(-5deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  `
};

// Type definitions for styled components props
export interface DecorativeElementProps {
  size?: string;
  left?: string;
  top?: string;
  delay?: number;
  emoji?: string;
  animationDelay?: number;
}

// Neobrutalism theme colors
export const neoBrutalismColors = {
  primary: '#ff45a0',
  primaryLight: '#ffd1e8',
  primaryLighter: '#ffe3f1',
  accent: '#fff9c4',
  dark: '#000000',
  light: '#FFFFFF'
};

// Neobrutalism styles for various components
export const neoBrutalismStyles = {
  // Container styles
  container: (theme: any) => ({
    backgroundImage: `linear-gradient(45deg, ${neoBrutalismColors.primaryLight} 25%, ${neoBrutalismColors.primaryLighter} 25%, ${neoBrutalismColors.primaryLighter} 50%, ${neoBrutalismColors.primaryLight} 50%, ${neoBrutalismColors.primaryLight} 75%, ${neoBrutalismColors.primaryLighter} 75%, ${neoBrutalismColors.primaryLighter} 100%)`,
    backgroundSize: '40px 40px',
    position: 'relative',
    overflow: 'hidden',
    ...(theme?.breakpoints ? {
      [theme.breakpoints.down('sm')]: {
        backgroundSize: '30px 30px',
      },
    } : {}),
  }),
  
  // Paper styles
  paper: (theme: any) => ({
    padding: '2.8rem',
    textAlign: 'center',
    backgroundColor: neoBrutalismColors.light,
    border: `4px solid ${neoBrutalismColors.dark}`,
    borderRadius: '0px',
    boxShadow: `10px 10px 0px 0px ${neoBrutalismColors.dark}`,
    position: 'relative',
    transform: 'rotate(-1deg)',
    marginBottom: '30px',
    ...(theme?.breakpoints ? {
      [theme.breakpoints.up('lg')]: {
        padding: '3.2rem',
      },
      [theme.breakpoints.down('md')]: {
        boxShadow: `8px 8px 0px 0px ${neoBrutalismColors.dark}`,
      },
      [theme.breakpoints.down('sm')]: {
        padding: '1.8rem',
        transform: 'rotate(0deg)',
        boxShadow: `6px 6px 0px 0px ${neoBrutalismColors.dark}`,
        border: `3px solid ${neoBrutalismColors.dark}`,
      },
    } : {}),
  }),
  
  // Button styles
  button: (theme: any) => ({
    backgroundColor: neoBrutalismColors.primary,
    color: neoBrutalismColors.dark,
    fontWeight: 'bold',
    borderRadius: '0px',
    border: `3px solid ${neoBrutalismColors.dark}`,
    padding: '14px 20px',
    boxShadow: `6px 6px 0px 0px ${neoBrutalismColors.dark}`,
    textTransform: 'uppercase',
    transition: 'all 0.2s ease',
    fontSize: '1.2rem',
    letterSpacing: '1.5px',
    '&:hover': {
      backgroundColor: neoBrutalismColors.primary,
      boxShadow: `2px 2px 0px 0px ${neoBrutalismColors.dark}`,
      transform: 'translate(3px, 3px)',
    },
    ...(theme?.breakpoints ? {
      [theme.breakpoints.down('md')]: {
        fontSize: '1.1rem',
        padding: '12px 16px',
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
        padding: '10px 15px',
        boxShadow: `4px 4px 0px 0px ${neoBrutalismColors.dark}`,
        border: `2px solid ${neoBrutalismColors.dark}`,
      },
    } : {}),
  }),
  
  // Secondary button styles (yellow background)
  secondaryButton: (theme: any) => ({
    backgroundColor: neoBrutalismColors.accent,
    '&:hover': {
      backgroundColor: neoBrutalismColors.accent,
    },
  }),
  
  // Title styles
  title: (theme: any) => ({
    color: neoBrutalismColors.primary,
    fontWeight: 900,
    fontSize: '3.2rem',
    textTransform: 'uppercase',
    textShadow: `5px 5px 0px ${neoBrutalismColors.dark}`,
    marginBottom: '1rem',
    transform: 'rotate(-2deg)',
    display: 'inline-block',
    letterSpacing: '3px',
    ...(theme?.breakpoints ? {
      [theme.breakpoints.down('md')]: {
        fontSize: '2.7rem',
        textShadow: `4px 4px 0px ${neoBrutalismColors.dark}`,
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '2.2rem',
        textShadow: `3px 3px 0px ${neoBrutalismColors.dark}`,
        transform: 'rotate(-1deg)',
      },
    } : {}),
  }),
  
  // Subtitle styles
  subtitle: (theme: any) => ({
    fontSize: '1.6rem',
    fontWeight: 'bold',
    backgroundColor: neoBrutalismColors.accent,
    padding: '10px 15px',
    border: `3px solid ${neoBrutalismColors.dark}`,
    display: 'inline-block',
    boxShadow: `5px 5px 0px 0px ${neoBrutalismColors.dark}`,
    marginBottom: '2.5rem',
    transform: 'rotate(1deg)',
    ...(theme?.breakpoints ? {
      [theme.breakpoints.down('md')]: {
        fontSize: '1.4rem',
        padding: '8px 12px',
        boxShadow: `4px 4px 0px 0px ${neoBrutalismColors.dark}`,
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.2rem',
        padding: '6px 10px',
        boxShadow: `3px 3px 0px 0px ${neoBrutalismColors.dark}`,
        border: `2px solid ${neoBrutalismColors.dark}`,
        transform: 'rotate(0deg)',
      },
    } : {}),
  }),
  
  // Feature box styles
  featureBox: (theme: any) => ({
    backgroundColor: neoBrutalismColors.primaryLight,
    border: `3px solid ${neoBrutalismColors.dark}`,
    padding: '25px',
    height: '100%',
    boxShadow: `8px 8px 0px 0px ${neoBrutalismColors.dark}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translate(-3px, -3px)',
      boxShadow: `11px 11px 0px 0px ${neoBrutalismColors.dark}`,
    },
    ...(theme?.breakpoints ? {
      [theme.breakpoints.down('sm')]: {
        padding: '20px',
        border: `2px solid ${neoBrutalismColors.dark}`,
        boxShadow: `5px 5px 0px 0px ${neoBrutalismColors.dark}`,
      },
    } : {}),
  }),
  
  // Feature title styles
  featureTitle: (theme: any) => ({
    fontWeight: 'bold',
    fontSize: '1.4rem',
    backgroundColor: neoBrutalismColors.light,
    display: 'inline-block',
    padding: '5px 10px',
    border: `2px solid ${neoBrutalismColors.dark}`,
    marginBottom: '15px',
    ...(theme?.breakpoints ? {
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.2rem',
      },
    } : {}),
  }),
  
  // Logo container styles
  logoContainer: (theme: any) => ({
    backgroundColor: neoBrutalismColors.light,
    border: `4px solid ${neoBrutalismColors.dark}`,
    padding: '20px 30px',
    display: 'inline-block',
    boxShadow: `8px 8px 0px 0px ${neoBrutalismColors.dark}`,
    marginBottom: '30px',
    transform: 'rotate(2deg)',
    ...(theme?.breakpoints ? {
      [theme.breakpoints.down('md')]: {
        padding: '15px 25px',
        boxShadow: `6px 6px 0px 0px ${neoBrutalismColors.dark}`,
      },
      [theme.breakpoints.down('sm')]: {
        padding: '10px 20px',
        boxShadow: `4px 4px 0px 0px ${neoBrutalismColors.dark}`,
        border: `3px solid ${neoBrutalismColors.dark}`,
        transform: 'rotate(1deg)',
      },
    } : {}),
  }),
  
  // Bubble speech styles
  bubbleSpeech: (theme: any) => ({
    backgroundColor: neoBrutalismColors.light,
    border: `3px solid ${neoBrutalismColors.dark}`,
    borderRadius: '20px',
    padding: '10px 15px',
    fontSize: '16px',
    fontWeight: 'bold',
    position: 'relative',
    marginBottom: '5px',
    boxShadow: `3px 3px 0px 0px ${neoBrutalismColors.dark}`,
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '-10px',
      left: '20px',
      width: '15px',
      height: '15px',
      backgroundColor: neoBrutalismColors.light,
      border: `3px solid ${neoBrutalismColors.dark}`,
      borderTop: 'none',
      borderLeft: 'none',
      transform: 'rotate(45deg)',
    },
  }),
  
  // Call to action styles
  callToAction: (theme: any) => ({
    display: 'inline-block',
    backgroundColor: neoBrutalismColors.primary, 
    color: neoBrutalismColors.light,
    fontWeight: 'bold',
    border: `2px solid ${neoBrutalismColors.dark}`,
    padding: '8px 15px',
    boxShadow: `4px 4px 0px 0px ${neoBrutalismColors.dark}`,
  }),
  
  // Journey step styles (for timeline/journey visualization)
  journeyStep: (theme: any) => ({
    display: 'flex', 
    alignItems: 'center',
    backgroundColor: neoBrutalismColors.light,
    borderRadius: '15px',
    border: `2px dashed ${neoBrutalismColors.dark}`,
    padding: '10px 15px',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: `3px 3px 0px 0px ${neoBrutalismColors.dark}`,
  }),
  
  // Decorative element styles
  decorativeHeart: (props: DecorativeElementProps) => ({
    position: 'absolute',
    left: props.left,
    top: props.top,
    width: props.size,
    height: props.size,
    color: neoBrutalismColors.primary,
    zIndex: 0,
    animation: `${keyframesAnimations.heartBeat} 2s infinite ${props.delay}s`,
    fontSize: props.size,
    opacity: 0.6,
    '&:before': {
      content: '"❤️"',
    },
  }),
  
  decorativeCoin: (props: DecorativeElementProps) => ({
    position: 'absolute',
    left: props.left,
    top: props.top,
    width: props.size,
    height: props.size,
    zIndex: 0,
    animation: `${keyframesAnimations.coinDrop} 1s forwards ${props.delay}s`,
    fontSize: props.size,
    opacity: 0.7,
    '&:before': {
      content: '"💰"',
    },
  }),
  
  decorativeObject: (props: DecorativeElementProps) => ({
    position: 'absolute',
    left: props.left,
    top: props.top,
    fontSize: props.size,
    zIndex: 0,
    animation: `${keyframesAnimations.moveAround} 7s infinite ease-in-out ${props.animationDelay}s`,
    opacity: 0.7,
    '&:before': {
      content: `"${props.emoji}"`,
    },
  }),
};

export default neoBrutalismStyles;