# CSS Architecture Guide

## Overview

This project uses a modern CSS architecture that emphasizes:
- **Design tokens** for consistent values
- **Utility classes** for common patterns
- **CSS Modules** for component isolation
- **Minimal duplication** through systematic reuse

## File Structure

```
src/
├── design-tokens.css      # Core design system values
├── styles/
│   ├── global.css        # Global styles and resets
│   ├── utilities.css     # Utility classes
│   └── README.md         # This file
└── components/
    └── *.module.css      # Component-specific styles
```

## Design Tokens

All design decisions are centralized in `design-tokens.css`:

### Color Tokens
- `--primary`, `--secondary`, `--success`, `--warning`, `--error`
- Surface colors: `--surface`, `--background`, `--surface-variant`
- Text colors: `--text-primary`, `--text-secondary`
- Game-specific: `--color-felt-green`, `--color-domino-white`, etc.

### Spacing Scale
8-point grid system:
- `--spacing-xs`: 0.25rem (4px)
- `--spacing-sm`: 0.5rem (8px)
- `--spacing-md`: 1rem (16px)
- `--spacing-lg`: 1.5rem (24px)
- `--spacing-xl`: 2rem (32px)
- `--spacing-2xl`: 3rem (48px)

### Typography
- Font sizes: `--font-size-xs` through `--font-size-3xl`
- Font families: `--font-family-base`, `--font-family-mono`
- Line heights: `--line-height-tight`, `--line-height-normal`, `--line-height-relaxed`

### Other Tokens
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
- Border radius: `--radius-sm`, `--radius-md`, `--radius-lg`
- Transitions: `--transition-fast`, `--transition-normal`, `--transition-slow`
- Z-index layers: `--z-dropdown`, `--z-modal`, `--z-popover`, etc.

## Utility Classes

Common patterns available in `utilities.css`:

### Layout
```css
.flex, .flex-column, .flex-center, .flex-between
.grid, .gap-{xs|sm|md|lg|xl}
```

### Spacing
```css
.p-{xs|sm|md|lg|xl}    /* padding */
.m-{xs|sm|md|lg|xl}    /* margin */
.px-{size}, .py-{size}  /* padding x/y axis */
.mx-auto               /* center horizontally */
```

### Typography
```css
.text-{xs|sm|md|lg|xl|2xl}
.text-{left|center|right}
.font-{normal|semibold|bold}
.font-mono
```

### Colors
```css
.text-{primary|secondary|success|warning|error|muted}
.bg-{primary|secondary|surface|background}
```

### Interactive States
```css
.interactive         /* hover lift effect */
.interactive-scale   /* hover scale effect */
```

### Components
```css
.card, .card-compact, .card-large
.btn, .btn-secondary, .btn-outline
.shadow-{sm|md|lg|xl}
```

## Component Styles

Component CSS modules should:

1. **Import design tokens** at the top:
   ```css
   @import '../design-tokens.css';
   ```

2. **Use design tokens** instead of hardcoded values:
   ```css
   /* ❌ Bad */
   padding: 16px;
   color: #333;
   
   /* ✅ Good */
   padding: var(--spacing-md);
   color: var(--text-primary);
   ```

3. **Leverage utility classes** in JSX when appropriate:
   ```jsx
   <div className={`${styles.container} card shadow-md`}>
   ```

## Migration Guide

When refactoring existing CSS:

1. **Replace hardcoded colors** with color tokens
2. **Replace spacing values** with spacing tokens
3. **Replace shadows** with shadow tokens
4. **Use transition tokens** for animations
5. **Apply utility classes** for common patterns
6. **Remove duplicate styles** that utilities handle

## Best Practices

1. **Always use tokens** for values that appear in the design system
2. **Create new tokens** before adding hardcoded values
3. **Use utilities** for one-off styles instead of creating new classes
4. **Keep specificity low** - avoid deep nesting
5. **Mobile-first** - use min-width media queries
6. **Semantic naming** - describe purpose, not appearance

## Performance Tips

1. **Import only what you need** - don't import all utilities everywhere
2. **Avoid runtime style calculations** - use CSS variables
3. **Minimize CSS-in-JS** - prefer CSS modules
4. **Group media queries** at the end of files

## Examples

### Card Component
```css
/* Instead of this: */
.card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Use this: */
.card {
  background: var(--surface);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

/* Or use the utility class: */
<div className="card">
```

### Responsive Spacing
```css
/* Use consistent breakpoints */
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
  }
}
```

## Maintenance

- Run `npm run lint` to check for CSS issues
- Keep tokens organized and documented
- Review new CSS for hardcoded values
- Consolidate similar patterns into utilities