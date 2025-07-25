# CSS Architecture Guide - Texas 42 Web Game

## Overview
This document outlines the CSS architecture for the Texas 42 Web Game frontend, providing guidelines for maintaining and extending the styling system.

## Architecture Structure

### 1. Design Tokens (`/src/styles/design-tokens.css`)
The foundation of our design system, containing ~500+ CSS custom properties:

- **Colors**: Brand colors, UI colors, game-specific colors, opacity variations
- **Spacing**: Consistent spacing scale from `--space-xxs` to `--space-4xl`
- **Typography**: Font families, sizes, weights, line heights
- **Borders**: Widths, radius values, colors
- **Shadows**: Elevation system for depth
- **Transitions**: Animation durations and timing functions
- **Breakpoints**: Responsive design breakpoints
- **Z-index**: Layering scale

### 2. Base Classes (`/src/styles/base-classes.css`)
Foundational component patterns used across the application:

- Section containers and headers
- Card components
- Button variations
- Form controls
- Status badges
- Layout containers
- Grid systems
- Modal/dialog patterns
- Game-specific patterns

### 3. Pattern Library (`/src/styles/patterns/`)
Reusable design patterns:

- **animations.css**: Shared keyframe animations and animation utilities
- **common.css**: Glass morphism, cards, modals, sections, forms
- **buttons.css**: Button component styles
- **cards.css**: Card component patterns
- **forms.css**: Form and input patterns
- **status.css**: Status indicators and badges

### 4. Utility Classes (`/src/styles/utilities/`)
Single-purpose utility classes:

- **backgrounds.css**: Background colors and patterns
- **borders.css**: Border utilities
- **display.css**: Display properties
- **effects.css**: Visual effects (shadows, opacity, filters)
- **interactive.css**: Hover states, cursors, user interaction
- **layout.css**: Flexbox and grid utilities
- **responsive.css**: Responsive display utilities
- **sizing.css**: Width, height, and sizing utilities
- **spacing.css**: Margin and padding utilities
- **typography.css**: Text styling utilities
- **media-queries.css**: Responsive breakpoint documentation

### 5. Component Styles (`/src/components/**/*.module.css`)
Component-specific styles using CSS Modules for scoping:

- Each component has its own `.module.css` file
- Styles are locally scoped to prevent conflicts
- Can compose from shared patterns and utilities
- Should use design tokens for all values

## Best Practices

### 1. Always Use Design Tokens
```css
/* ❌ Bad */
.button {
  padding: 8px 16px;
  color: #0066cc;
  border-radius: 4px;
}

/* ✅ Good */
.button {
  padding: var(--space-sm) var(--space-base);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
}
```

### 2. Responsive Design
Use consistent breakpoints with comments:
```css
/* Tablet breakpoint: var(--breakpoint-md) = 768px */
@media (max-width: 768px) {
  /* styles */
}

/* Mobile breakpoint: var(--breakpoint-sm) = 480px */
@media (max-width: 480px) {
  /* styles */
}
```

### 3. Component Composition
Leverage shared patterns to reduce duplication:
```css
/* Component-specific styles */
.gameCard {
  composes: card-common from '../../styles/patterns/common.css';
  composes: interactive-hover from '../../styles/patterns/common.css';
  /* Additional specific styles */
}
```

### 4. Animation Usage
Import animations from the shared library:
```css
/* Use shared animations */
.loadingSpinner {
  animation: spin 1s linear infinite;
}
/* Note: spin animation imported from patterns/animations.css */
```

### 5. Naming Conventions
- **Design tokens**: Kebab-case with semantic names (`--color-primary`, `--space-base`)
- **CSS classes**: camelCase for CSS Modules, kebab-case for utilities
- **Breakpoints**: Use size names (sm, md, lg) not device names

## File Organization

```
frontend/src/
├── styles/
│   ├── design-tokens.css    # Core design system variables
│   ├── base-classes.css     # Foundational component classes
│   ├── patterns/            # Reusable pattern library
│   │   ├── index.css
│   │   ├── animations.css
│   │   ├── common.css
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── forms.css
│   │   └── status.css
│   └── utilities/           # Single-purpose utilities
│       ├── index.css
│       ├── backgrounds.css
│       ├── borders.css
│       ├── display.css
│       ├── effects.css
│       ├── interactive.css
│       ├── layout.css
│       ├── responsive.css
│       ├── sizing.css
│       ├── spacing.css
│       ├── typography.css
│       └── media-queries.css
├── components/
│   └── **/*.module.css     # Component-specific styles
└── index.css               # Global styles and resets
```

## Adding New Styles

### 1. Check Design Tokens First
Before adding any new value, check if a design token already exists.

### 2. Determine the Right Location
- **Global pattern?** → Add to `/styles/patterns/`
- **Single purpose?** → Add to `/styles/utilities/`
- **Component only?** → Keep in component's `.module.css`

### 3. Follow the Cascade
1. Design tokens provide values
2. Base classes provide foundational patterns
3. Patterns provide reusable components
4. Utilities provide overrides
5. Component styles provide specifics

### 4. Document Complex Styles
Add comments for non-obvious styling decisions:
```css
/* Create depth with inset shadow to simulate felt texture */
.gameBoard {
  box-shadow: inset 0 0 20px var(--color-board-inset);
}
```

## Performance Considerations

1. **Minimize Specificity**: Use simple selectors when possible
2. **Avoid Deep Nesting**: Keep selectors shallow
3. **Use CSS Variables**: Enable runtime theming without duplication
4. **Leverage Composition**: Reuse patterns instead of duplicating
5. **Critical CSS**: Consider inlining critical above-fold styles

## Maintenance

### Regular Audits
1. Check for unused CSS classes quarterly
2. Ensure new components use design tokens
3. Look for duplicate patterns that can be extracted
4. Verify responsive behavior on all breakpoints

### Deprecation Process
1. Mark deprecated styles with comments
2. Update components to use new patterns
3. Remove after confirming no usage

### Adding Design Tokens
1. Add to appropriate section in `design-tokens.css`
2. Use semantic naming that describes purpose
3. Document the token's intended use
4. Update this guide if adding new categories

## Common Patterns

### Glass Morphism Effect
```css
.glass-surface {
  background: var(--surface-glass);
  backdrop-filter: blur(8px);
  border: var(--border-subtle);
}
```

### Card Hover State
```css
.card:hover {
  transform: var(--transform-hover);
  box-shadow: var(--shadow-md);
}
```

### Responsive Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-base);
}
```

## Resources

- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [Design Tokens W3C Spec](https://design-tokens.github.io/community-group/format/)

## Version History

- **v1.0** (2024): Initial CSS architecture implementation
- **v1.1** (2024): Added shared animations and common patterns
- **v1.2** (2024): Standardized breakpoints and responsive utilities