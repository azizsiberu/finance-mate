import React, { ReactNode, useMemo } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme, Theme, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';
import { neoBrutalismColors } from './neobrutalism';

// Properti untuk tema
type ThemeProviderProps = {
  children: ReactNode;
  mode?: PaletteMode;
};

// Theme Provider khusus untuk aplikasi Finance Mate
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  mode = 'light' // Default mode adalah light
}) => {
  // Membuat tema yang sesuai dengan mode (light/dark)
  const theme: Theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: neoBrutalismColors.primary,
          light: neoBrutalismColors.primaryLight,
        },
        secondary: {
          main: neoBrutalismColors.accent,
        },
        background: {
          default: mode === 'dark' ? '#121212' : '#f5f5f5',
          paper: mode === 'dark' ? '#1e1e1e' : neoBrutalismColors.light,
        },
        text: {
          primary: mode === 'dark' ? '#ffffff' : '#000000',
          secondary: mode === 'dark' ? '#b0b0b0' : '#505050',
        },
      },
      typography: {
        fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 900,
          letterSpacing: '0.05em',
        },
        h2: {
          fontWeight: 800,
          letterSpacing: '0.05em',
        },
        h3: {
          fontWeight: 800,
        },
        h4: {
          fontWeight: 700,
        },
        h5: {
          fontWeight: 700,
        },
        h6: {
          fontWeight: 700,
        },
        button: {
          fontWeight: 700,
          letterSpacing: '0.05em',
        },
      },
      shape: {
        borderRadius: 0, // Karakteristik neobrutalism - sudut tajam
      },
      transitions: {
        easing: {
          // Transisi yang lebih playful
          easeInOut: 'cubic-bezier(0.6, 0, 0.4, 1)',
        },
      },
      shadows: [
        'none',
        // Shadow lebih tajam untuk neobrutalism
        '4px 4px 0px 0px rgba(0,0,0,1)',
        '5px 5px 0px 0px rgba(0,0,0,1)',
        '6px 6px 0px 0px rgba(0,0,0,1)',
        '7px 7px 0px 0px rgba(0,0,0,1)',
        '8px 8px 0px 0px rgba(0,0,0,1)',
        '9px 9px 0px 0px rgba(0,0,0,1)',
        '10px 10px 0px 0px rgba(0,0,0,1)',
        '11px 11px 0px 0px rgba(0,0,0,1)',
        '12px 12px 0px 0px rgba(0,0,0,1)',
        '13px 13px 0px 0px rgba(0,0,0,1)',
        '14px 14px 0px 0px rgba(0,0,0,1)',
        '15px 15px 0px 0px rgba(0,0,0,1)',
        '16px 16px 0px 0px rgba(0,0,0,1)',
        '17px 17px 0px 0px rgba(0,0,0,1)',
        '18px 18px 0px 0px rgba(0,0,0,1)',
        '19px 19px 0px 0px rgba(0,0,0,1)',
        '20px 20px 0px 0px rgba(0,0,0,1)',
        '21px 21px 0px 0px rgba(0,0,0,1)',
        '22px 22px 0px 0px rgba(0,0,0,1)',
        '23px 23px 0px 0px rgba(0,0,0,1)',
        '24px 24px 0px 0px rgba(0,0,0,1)',
        '25px 25px 0px 0px rgba(0,0,0,1)',
        '26px 26px 0px 0px rgba(0,0,0,1)', // Menambahkan dua bayangan lagi untuk memenuhi 25 elemen
        '27px 27px 0px 0px rgba(0,0,0,1)',
      ],
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              textTransform: 'uppercase',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
              border: '2px solid #000000',
              '&:hover': {
                boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)',
                transform: 'translate(2px, 2px)',
              },
            },
            contained: {
              backgroundColor: neoBrutalismColors.primary,
              color: mode === 'dark' ? '#000000' : '#000000',
            },
            outlined: {
              borderWidth: '2px',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: '10px 10px 0px 0px rgba(0,0,0,1)',
              borderRadius: 0,
              border: '3px solid #000000',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)',
              borderRadius: 0,
              border: '2px solid #000000',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                border: '2px solid #000000',
                backgroundColor: mode === 'dark' ? '#2d2d2d' : '#ffffff',
                '& fieldset': {
                  border: 'none',
                },
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: '0px',
              fontWeight: 'bold',
            },
          },
        },
        MuiToggleButton: {
          styleOverrides: {
            root: {
              borderRadius: '0px',
              border: '2px solid #000000',
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeProvider;