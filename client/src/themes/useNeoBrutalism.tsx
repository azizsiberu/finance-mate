import { Box, Button, Typography, Paper } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import neoBrutalismStyles, { keyframesAnimations, DecorativeElementProps } from './neobrutalism';

// Menggunakan sx props sebagai pendekatan alternatif yang lebih kompatibel dengan MUI v7
export const neoBrutalSx = {
  paper: (theme: Theme): SxProps => ({
    ...neoBrutalismStyles.paper(theme)
  }),
  
  button: (theme: Theme): SxProps => ({
    ...neoBrutalismStyles.button(theme)
  }),
  
  secondaryButton: (theme: Theme): SxProps => ({
    ...neoBrutalismStyles.button(theme),
    ...neoBrutalismStyles.secondaryButton(theme)
  }),
  
  title: (theme: Theme): SxProps => ({
    ...neoBrutalismStyles.title(theme)
  }),
  
  subtitle: (theme: Theme): SxProps => ({
    ...neoBrutalismStyles.subtitle(theme)
  }),
  
  featureBox: (theme: Theme): SxProps => ({
    ...neoBrutalismStyles.featureBox(theme)
  }),
  
  featureTitle: (theme: Theme): SxProps => ({
    ...neoBrutalismStyles.featureTitle(theme)
  }),
  
  logoContainer: (theme: Theme): SxProps => ({
    ...neoBrutalismStyles.logoContainer(theme)
  }),
  
  bubbleSpeech: (theme: Theme): SxProps => ({
    ...neoBrutalismStyles.bubbleSpeech(theme)
  }),
  
  journeyStep: (theme: Theme): SxProps => ({
    ...neoBrutalismStyles.journeyStep(theme)
  }),
  
  callToAction: (theme: Theme): SxProps => ({
    ...neoBrutalismStyles.callToAction(theme)
  }),
  
  // Elemen dekoratif
  decorativeHeart: (props: DecorativeElementProps): SxProps => ({
    position: 'absolute',
    left: props.left,
    top: props.top,
    width: props.size,
    height: props.size,
    color: '#ff45a0',
    zIndex: 0,
    animation: `${keyframesAnimations.heartBeat} 2s infinite ${props.delay || 0}s`,
    fontSize: props.size,
    opacity: 0.6,
    '&:before': {
      content: '"❤️"',
    },
  }),
  
  decorativeCoin: (props: DecorativeElementProps): SxProps => ({
    position: 'absolute',
    left: props.left,
    top: props.top,
    width: props.size,
    height: props.size,
    zIndex: 0,
    animation: `${keyframesAnimations.coinDrop} 1s forwards ${props.delay || 0}s`,
    fontSize: props.size,
    opacity: 0.7,
    '&:before': {
      content: '"💰"',
    },
  }),
  
  decorativeObject: (props: DecorativeElementProps): SxProps => ({
    position: 'absolute',
    left: props.left,
    top: props.top,
    fontSize: props.size,
    zIndex: 0,
    animation: `${keyframesAnimations.moveAround} 7s infinite ease-in-out ${props.animationDelay || 0}s`,
    opacity: 0.7,
    '&:before': {
      content: `"${props.emoji || '💫'}"`,
    },
  }),
};

// Komponen Wrapper untuk mempermudah penggunaan
export const NeoBrutalComponents = {
  Paper: (props: any) => (
    <Paper 
      {...props} 
      sx={{ 
        ...neoBrutalSx.paper(props.theme), 
        ...(props.sx || {}) 
      }} 
    />
  ),
  
  Button: (props: any) => (
    <Button 
      {...props} 
      sx={{ 
        ...neoBrutalSx.button(props.theme), 
        ...(props.sx || {}) 
      }} 
    />
  ),
  
  SecondaryButton: (props: any) => (
    <Button 
      {...props} 
      sx={{ 
        ...neoBrutalSx.secondaryButton(props.theme), 
        ...(props.sx || {}) 
      }} 
    />
  ),
  
  Title: (props: any) => (
    <Typography 
      {...props} 
      sx={{ 
        ...neoBrutalSx.title(props.theme), 
        ...(props.sx || {}) 
      }} 
    />
  ),
  
  Subtitle: (props: any) => (
    <Typography 
      {...props} 
      sx={{ 
        ...neoBrutalSx.subtitle(props.theme), 
        ...(props.sx || {}) 
      }} 
    />
  ),
  
  FeatureBox: (props: any) => (
    <Box 
      {...props} 
      sx={{ 
        ...neoBrutalSx.featureBox(props.theme), 
        ...(props.sx || {}) 
      }} 
    />
  ),
  
  FeatureTitle: (props: any) => (
    <Typography 
      {...props} 
      sx={{ 
        ...neoBrutalSx.featureTitle(props.theme), 
        ...(props.sx || {}) 
      }} 
    />
  ),
  
  LogoContainer: (props: any) => (
    <Box 
      {...props} 
      sx={{ 
        ...neoBrutalSx.logoContainer(props.theme), 
        ...(props.sx || {}) 
      }} 
    />
  ),
  
  BubbleSpeech: (props: any) => (
    <Box 
      {...props} 
      sx={{ 
        ...neoBrutalSx.bubbleSpeech(props.theme), 
        ...(props.sx || {}) 
      }} 
    />
  ),
  
  JourneyStep: (props: any) => (
    <Box 
      {...props} 
      sx={{ 
        ...neoBrutalSx.journeyStep(props.theme), 
        ...(props.sx || {}) 
      }} 
    />
  ),
  
  CallToAction: (props: any) => (
    <Typography 
      {...props} 
      sx={{ 
        ...neoBrutalSx.callToAction(props.theme), 
        ...(props.sx || {}) 
      }} 
    />
  ),
  
  DecorativeHeart: (props: any & DecorativeElementProps) => (
    <Box 
      {...props} 
      sx={{ 
        ...neoBrutalSx.decorativeHeart(props), 
        ...(props.sx || {}) 
      }} 
    />
  ),
  
  DecorativeCoin: (props: any & DecorativeElementProps) => (
    <Box 
      {...props} 
      sx={{ 
        ...neoBrutalSx.decorativeCoin(props), 
        ...(props.sx || {}) 
      }} 
    />
  ),
  
  DecorativeObject: (props: any & DecorativeElementProps) => {
    // Destructure animationDelay from props to avoid passing it to DOM
    const { animationDelay, ...domProps } = props;
    return (
      <Box 
        {...domProps} 
        sx={{ 
          ...neoBrutalSx.decorativeObject(props), 
          ...(props.sx || {}) 
        }} 
      />
    );
  },
};

// Mengekspor animasi untuk digunakan di komponen lain
export const animations = keyframesAnimations;

// Hook untuk menggunakan semua komponen neobrutalism di satu tempat
export const useNeoBrutalism = () => {
  return {
    sx: neoBrutalSx,
    ...NeoBrutalComponents,
    animations
  };
};

export default useNeoBrutalism;