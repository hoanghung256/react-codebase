# GitHub Copilot UI/UX Instructions - Intervu Project

## 1. 🎯 Project Goal

**Goal**: Build a front-end for our Mock Interview application with a UI inspired by the Exponent website.

**Tech Stack**: 
- React (JavaScript)
- Redux Toolkit (State Management)
- Material-UI (MUI)
- React Router DOM
- Axios

## 2. 🎨 Core Design System (Design Tokens)

All visual elements MUST strictly adhere to these values defined in the MUI theme.

### 2.1. Color Palette

Primary theme: **Indigo/Violet** (matching Exponent style)

```javascript
// src/common/constants/theme.jsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
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
});
```

### 2.2. Typography

**Primary Font**: Inter (from Google Fonts)

```javascript
// src/common/constants/theme.jsx (continued)
const theme = createTheme({
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
});
```

### 2.3. Shape & Spacing

**Border Radius**: 8px (rounded-lg)  
**Spacing Unit**: 8px (MUI default)

```javascript
// src/common/constants/theme.jsx (continued)
const theme = createTheme({
  shape: {
    borderRadius: 8,
  },
  
  spacing: 8, // Default spacing unit (8px)
});
```

**Usage Examples**:
```jsx
// Spacing: theme.spacing(1) = 8px, theme.spacing(2) = 16px, etc.
<Box sx={{ padding: theme.spacing(3) }}> // 24px padding
<Stack spacing={2}> // 16px gap between items
```

---

## 3. 🧩 Component Principles

Override MUI default styles to match Exponent's design language.

### 3.1. Buttons (MuiButton)

**Variants**:
- **Contained** (Primary): Use `primary.main` color
- **Outlined** (Secondary): Use `divider` color for border, `text.secondary` for text
- **Text**: For tertiary actions

**Rules**:
- ✅ Always use `textTransform: 'none'` (no uppercase)
- ✅ Font weight: 600 (semibold)
- ✅ No box shadows
- ✅ Border radius from `theme.shape.borderRadius`

```javascript
// src/common/constants/theme.jsx (continued)
const theme = createTheme({
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
  },
});
```

**Usage Example**:
```jsx
<Button variant="contained" color="primary">Book now</Button>
<Button variant="outlined" color="primary">Learn more</Button>
<Button variant="text">Cancel</Button>
```

### 3.2. Cards (MuiCard, MuiPaper)

**Style**: Use both border AND shadow for depth

**Variants**:
- **Outlined** (Preferred): `variant="outlined"` with custom shadow
- **Elevation**: `elevation={1}` or `elevation={2}`

```javascript
// src/common/constants/theme.jsx (continued)
const theme = createTheme({
  components: {
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
```

**Usage Example**:
```jsx
<Card>
  <CardContent>
    <Typography variant="h5">Title</Typography>
    <Typography variant="body2">Description</Typography>
  </CardContent>
</Card>
```

### 3.3. Chips/Tags (MuiChip)

**Style**: Rounded pill shape with light background

```javascript
// src/common/constants/theme.jsx (continued)
const theme = createTheme({
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '9999px', // Full rounded
          backgroundColor: '#F3F4F6', // gray-100
          color: '#374151', // gray-700
          fontWeight: 500,
          fontSize: '0.813rem', // 13px
          height: '28px',
        },
        label: {
          padding: '0 12px',
        },
      },
    },
  },
});
```

**Usage Example**:
```jsx
<Chip label="JavaScript" />
<Chip label="React" />
<Chip label="Node.js" color="primary" />
```

### 3.4. Navigation Bar (MuiAppBar)

**Style**: White background, no shadow, bottom border only

```javascript
// src/common/constants/theme.jsx (continued)
const theme = createTheme({
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: 'sticky',
      },
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#111827',
          boxShadow: 'none',
          borderBottom: '1px solid #E5E7EB',
        },
      },
    },
  },
});
```

**Usage Example**:
```jsx
<AppBar>
  <Toolbar>
    <Typography variant="h6">Intervu</Typography>
    <Box sx={{ flexGrow: 1 }} />
    <Button color="inherit">Login</Button>
  </Toolbar>
</AppBar>
```

---

## 4. 📜 General Coding Rules

### 4.1. Always Use MUI Components

❌ **DON'T**:
```jsx
<div>Text</div>
<button>Click me</button>
<p>Paragraph</p>
```

✅ **DO**:
```jsx
<Box>Text</Box>
<Button>Click me</Button>
<Typography>Paragraph</Typography>
```

### 4.2. Use Theme Values

❌ **DON'T**:
```jsx
<Box sx={{ color: '#4F46E5', margin: '16px' }}>
```

✅ **DO**:
```jsx
<Box sx={{ 
  color: 'primary.main', 
  margin: theme => theme.spacing(2) 
}}>
```

### 4.3. Styling Methods

**Priority Order**:
1. **`sx` prop** - For simple, one-off styles
2. **`styled()`** - For complex, reusable components
3. **Theme overrides** - For global component styles

**Examples**:

```jsx
// 1. sx prop (simple styles)
<Button sx={{ 
  backgroundColor: 'primary.main',
  '&:hover': { backgroundColor: 'primary.dark' }
}}>
  Click me
</Button>

// 2. styled() utility (reusable components)
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(3),
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

// 3. Theme overrides (global styles) - Already shown above
```

### 4.4. Layout Components

**Use MUI layout components**:

```jsx
// Grid system
<Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    <Card>Content 1</Card>
  </Grid>
  <Grid item xs={12} md={6}>
    <Card>Content 2</Card>
  </Grid>
</Grid>

// Stack (flexbox helper)
<Stack direction="row" spacing={2} alignItems="center">
  <Avatar />
  <Typography>User Name</Typography>
</Stack>

// Box (generic container)
<Box sx={{ 
  display: 'flex', 
  justifyContent: 'space-between',
  padding: 3 
}}>
  <Typography>Left</Typography>
  <Typography>Right</Typography>
</Box>
```

### 4.5. Responsive Design

**Use MUI breakpoints**:

```jsx
<Box sx={{
  display: { xs: 'none', md: 'block' }, // Hidden on mobile, visible on desktop
  padding: { xs: 2, sm: 3, md: 4 },     // Different padding per breakpoint
  fontSize: { xs: '14px', md: '16px' },
}}>
  Responsive content
</Box>

// Breakpoints:
// xs: 0px (mobile)
// sm: 600px (tablet)
// md: 900px (small desktop)
// lg: 1200px (desktop)
// xl: 1536px (large desktop)
```

---

## 5. 🎨 Project-Specific Patterns

### 5.1. Feature Structure

Each feature should follow this structure:

```
src/features/[feature-name]/
├── components/          # Feature-specific components
│   ├── ComponentName.jsx
│   └── ComponentName.css (if needed)
├── pages/              # Page-level components
│   ├── PageName.jsx
│   └── PageName.css
├── services/           # API calls
│   └── featureApi.js
└── store/              # Redux slice
    └── featureSlice.js
```

### 5.2. Component Naming

- **Components**: PascalCase (e.g., `InterviewerCard.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useLoading.js`)
- **Services**: camelCase (e.g., `homeApi.js`)
- **Slices**: camelCase (e.g., `homeSlice.js`)

### 5.3. Common Patterns

**Loading State**:
```jsx
{loading ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
    <CircularProgress />
  </Box>
) : (
  <Content />
)}
```

**Empty State**:
```jsx
{items.length === 0 && (
  <Box sx={{ textAlign: 'center', py: 8 }}>
    <Typography variant="h6" color="text.secondary">
      😔 No items found
    </Typography>
  </Box>
)}
```

**Error State**:
```jsx
{error && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {error}
  </Alert>
)}
```

---

## 6. ✅ Checklist for New Components

Before creating a new component, ensure:

- [ ] Using MUI components (`<Box>`, `<Typography>`, `<Button>`, etc.)
- [ ] Colors from theme palette (`primary.main`, `text.secondary`, etc.)
- [ ] Spacing with `theme.spacing()` or `sx={{ p: 2 }}`
- [ ] Typography variants (`variant="h1"`, `variant="body1"`, etc.)
- [ ] Responsive design with breakpoints
- [ ] Proper border radius from `theme.shape.borderRadius`
- [ ] No custom colors outside theme
- [ ] Loading, error, and empty states handled

---

## 7. 🚫 Common Mistakes to Avoid

❌ **Using raw HTML elements**
```jsx
<div style={{ padding: '16px' }}>  // Wrong
```

✅ **Use MUI components**
```jsx
<Box sx={{ p: 2 }}>  // Correct
```

❌ **Hardcoded colors**
```jsx
<Typography sx={{ color: '#4F46E5' }}>  // Wrong
```

✅ **Theme colors**
```jsx
<Typography sx={{ color: 'primary.main' }}>  // Correct
```

❌ **Hardcoded spacing**
```jsx
<Box sx={{ marginTop: '24px' }}>  // Wrong
```

✅ **Theme spacing**
```jsx
<Box sx={{ mt: 3 }}>  // Correct (3 * 8px = 24px)
```

❌ **Inline styles**
```jsx
<div style={{ display: 'flex' }}>  // Wrong
```

✅ **sx prop or styled**
```jsx
<Box sx={{ display: 'flex' }}>  // Correct
```
