import { createTheme, alpha } from '@mui/material/styles';

// Define a cute and friendly color palette with Green as primary (matching logo)
const cutePalette = {
  primary: {
    main: '#4DBEA7', // Teal Green from Logo
    light: '#7DDAC3', // Lighter shade
    dark: '#3AA891', // Darker shade
    contrastText: '#fff',
  },
  secondary: {
    main: '#F7A8B8', // Soft Pink
    light: '#FBC4CF',
    dark: '#D98FA4',
    contrastText: '#fff',
  },
  background: {
    default: '#F4F7F6', // Very light grey/off-white
    paper: '#FFFFFF',
  },
  text: {
    primary: '#333333',
    secondary: '#667788',
  },
  action: {
    hover: alpha('#4DBEA7', 0.08), // Update hover based on new primary.main
  }
};

const theme = createTheme({
  palette: cutePalette,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif', // Use a slightly softer font like Inter if available
    h6: {
      fontWeight: 600, // Make headings slightly bolder
    },
    subtitle1: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // Keep button text case as is
      fontWeight: 600,
    }
  },
  shape: {
    borderRadius: 12, // Increase global border radius for softer corners
  },
  components: {
    // Override Card styles
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)', // Softer shadow
          // borderRadius defined globally by theme.shape.borderRadius
        },
      },
    },
    // Override Button styles
    MuiButton: {
      styleOverrides: {
        root: {
          // borderRadius defined globally by theme.shape.borderRadius
          boxShadow: 'none', // Remove default button shadow
          '&:hover': {
            boxShadow: 'none', // Ensure no shadow on hover either
          }
        },
        // If you want primary buttons to have a green shadow:
        // containedPrimary: {
        //   boxShadow: `0px 2px 4px ${alpha(cutePalette.primary.main, 0.3)}`,
        // }
      },
    },
     // Override Paper styles (used by Sidebar, Weatherbar etc.)
    MuiPaper: {
       styleOverrides: {
        root: {
           boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)', // Consistent softer shadow
           backgroundImage: 'none', // Ensure no gradient/image background by default
        }
      }
    },
    // Override Avatar styles
    MuiAvatar: {
      styleOverrides: {
        root: {
          // Could add slight border or keep it simple
          // border: `2px solid ${cutePalette.background.default}`
        }
      }
    },
    // Override IconButton styles
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: cutePalette.action.hover, // Uses updated hover color
          }
        }
      }
    },
    // Override List Item Button styles
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Specific override if theme.shape.borderRadius is too large
          margin: '4px 8px', // Add some margin around items
          padding: '8px 16px',
          '&:hover': {
            backgroundColor: cutePalette.action.hover, // Uses updated hover color
            // transform: 'scale(1.02)', // Optional subtle scale effect
            // transition: 'transform 0.1s ease-in-out',
          }
        }
      }
    }
  },
});

export default theme; 