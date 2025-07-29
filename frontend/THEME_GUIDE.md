# GreenSwap Theme System

This guide provides an overview of the theme system used in the GreenSwap application, including how to use the theme provider, toggle between themes, and style components consistently.

## Table of Contents
- [Theme Overview](#theme-overview)
- [Theme Toggle](#theme-toggle)
- [Using the Theme](#using-the-theme)
- [Available Theme Variables](#available-theme-variables)
- [Adding New Components](#adding-new-components)
- [Best Practices](#best-practices)

## Theme Overview

The GreenSwap application uses a modern, eco-friendly color scheme with both dark and light themes. The theme is implemented using Material-UI's theming system with custom configurations.

### Dark Theme (Default)
- **Background**: Dark gray/black (`#0f0f0f`)
- **Primary**: Vibrant green (`#00c853`)
- **Accent**: Minty light green (`#69f0ae`)
- **Text**: White (`#ffffff`) with secondary text at 70% opacity

### Light Theme
- **Background**: Cream (`#f9fbe7`)
- **Primary**: Forest green (`#388e3c`)
- **Accent**: Light green (`#aed581`)
- **Text**: Dark gray (`#212121`) with secondary text at 60% opacity

## Theme Toggle

The theme can be toggled using the floating action button in the bottom-right corner of the screen. The user's theme preference is saved in localStorage and persists between sessions.

## Using the Theme

### In Components

Use the `useTheme` hook from `@mui/material` to access theme variables:

```jsx
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <div style={{ 
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(2)
    }}>
      Styled content
    </div>
  );
}
```

### In Styled Components

Use the `styled` utility from `@mui/material` to create styled components with theme access:

```jsx
import { styled } from '@mui/material/styles';

const StyledButton = styled('button')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));
```

## Available Theme Variables

The theme provides the following variables that can be accessed:

### Colors
- `theme.palette.primary`: Primary brand color
- `theme.palette.secondary`: Secondary brand color
- `theme.palette.background`: Background colors
- `theme.palette.text`: Text colors
- `theme.palette.error`: Error state colors
- `theme.palette.warning`: Warning state colors
- `theme.palette.info`: Info state colors
- `theme.palette.success`: Success state colors

### Typography
- `theme.typography.h1` - `theme.typography.h6`: Heading styles
- `theme.typography.subtitle1`, `theme.typography.subtitle2`: Subtitle styles
- `theme.typography.body1`, `theme.typography.body2`: Body text styles
- `theme.typography.button`: Button text style
- `theme.typography.caption`: Caption/helper text style
- `theme.typography.overline`: Overline text style

### Spacing
Use the `theme.spacing()` helper for consistent spacing:
```jsx
// 8px * 2 = 16px
const spacing = theme.spacing(2);

// Different spacing on each side (top, right, bottom, left)
const spacing = theme.spacing(1, 2, 3, 4);
```

### Breakpoints
```jsx
// Usage in components
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

// In styled components
const StyledDiv = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));
```

## Adding New Components

When adding new components, follow these guidelines:

1. **Use theme variables** for colors, spacing, and typography
2. **Support both themes** by testing in both light and dark modes
3. **Use the spacing scale** for consistent margins and padding
4. **Leverage Material-UI components** when possible for built-in theming support

## Best Practices

1. **Consistent Styling**
   - Use theme variables instead of hardcoded values
   - Follow the design system for spacing and typography
   - Maintain consistent border radius and elevation

2. **Performance**
   - Use `useMemo` for expensive theme calculations
   - Leverage `sx` prop for one-off styles
   - Use `styled` for reusable styled components

3. **Accessibility**
   - Ensure sufficient color contrast
   - Use semantic HTML elements
   - Support keyboard navigation

4. **Responsive Design**
   - Use theme breakpoints for responsive layouts
   - Test on different screen sizes
   - Consider mobile-first approach

## Customizing the Theme

To modify the theme, edit the `getDesignTokens` function in `src/theme/ThemeProvider.jsx`.

Example of adding a custom color:
```js
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'dark' 
      ? {
          customColor: {
            main: '#yourColor',
            light: '#lightVariant',
            dark: '#darkVariant',
          },
        }
      : {
          customColor: {
            main: '#yourLightColor',
            light: '#lightVariant',
            dark: '#darkVariant',
          },
        }),
  },
});
```

## Troubleshooting

### Theme Not Updating
- Ensure components are wrapped with the `ThemeProvider`
- Check for any `!important` styles that might be overriding theme styles
- Verify that the component is re-rendering when the theme changes

### Styling Issues
- Use the browser's dev tools to inspect computed styles
- Check for CSS specificity issues
- Ensure you're using theme variables correctly

## Conclusion

The theme system provides a consistent look and feel across the GreenSwap application while supporting both light and dark modes. By following the guidelines in this document, you can ensure that new components integrate seamlessly with the existing design system.
