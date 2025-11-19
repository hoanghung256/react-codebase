import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        // Primary color (Indigo)
        primary: {
            main: '#4F46E5',    // indigo-600
            light: '#6366F1',   // indigo-500
            dark: '#4338CA',    // indigo-700
        },

        // Secondary color
        secondary: {
            main: '#8B5CF6',    // violet-500
            light: '#A78BFA',   // violet-400
            dark: '#7C3AED',    // violet-600
        },

        // Text colors
        text: {
            primary: '#111827',   // gray-900 (Headings)
            secondary: '#374151', // gray-700 (Body text)
            disabled: '#6B7280',  // gray-500 (Helper text)
        },

        // Background colors
        background: {
            default: '#F9FAFB',   // gray-50 (Main background)
            paper: '#FFFFFF',     // White (Cards, Paper)
        },

        // Border, divider
        divider: '#E5E7EB',     // gray-200

        // Status colors
        error: {
            main: '#EF4444',      // red-500
        },
        warning: {
            main: '#F59E0B',      // amber-500
        },
        success: {
            main: '#10B981',      // green-500
        },
        info: {
            main: '#3B82F6',      // blue-500
        },
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),

        // Headings
        h1: {
            fontSize: '2.25rem',  // 36px
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '1.875rem', // 30px
            fontWeight: 700,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.5rem',   // 24px
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.25rem',  // 20px
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.125rem', // 18px
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '1rem',     // 16px
            fontWeight: 600,
            lineHeight: 1.5,
        },

        // Body text
        body1: {
            fontSize: '1rem',     // 16px
            fontWeight: 400,
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem', // 14px
            fontWeight: 400,
            lineHeight: 1.5,
        },

        // Buttons
        button: {
            fontSize: '0.875rem', // 14px
            fontWeight: 600,
            textTransform: 'none',
        },

        // Captions
        caption: {
            fontSize: '0.75rem',  // 12px
            fontWeight: 400,
            lineHeight: 1.4,
        },
    },
    shape: {
        borderRadius: 8,
    },
    spacing: 8, // Default spacing unit (8px)
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 8,
                    padding: '10px 20px',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderWidth: '1.5px',
                    },
                },
            },
        },
        MuiCard: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    borderColor: '#E5E7EB',
                    borderRadius: 12,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                outlined: {
                    borderColor: '#E5E7EB',
                },
            },
        },
    },
});
