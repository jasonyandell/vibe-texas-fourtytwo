# GameBoard CSS Module Refactoring Guide

## Overview
This guide shows how to apply utility classes to the GameBoard component to replace CSS module styles.

## Refactoring Approach

### 1. Keep in CSS Module:
- Complex gradients and backgrounds
- Specific positioning values not in design tokens
- Media query overrides for custom values
- Transition values
- Complex borders with multiple properties

### 2. Replace with Utilities:
- Basic display properties (flex, grid, block)
- Padding and margin
- Simple backgrounds and colors
- Border radius
- Text alignment and typography
- Shadows and effects
- Sizing (width, height)
- Overflow properties

## Component Class Mappings

### Main GameBoard Container
```tsx
<div className={cn(
  styles.gameBoard,
  'w-full h-screen overflow-hidden',
  className
)}>
```

### Loading Message
```tsx
<div className="text-center p-2xl bg-surface rounded-lg">
  Loading game...
</div>
```

### Game Header
```tsx
<div className={cn(
  styles.gameHeader,
  'py-md px-2xl bg-surface'
)}>
```

### Game Header Minimap
```tsx
<div className={cn(
  styles.gameHeaderMinimap,
  'absolute p-sm rounded-md backdrop-blur-sm flex-column gap-xs text-sm text-primary'
)}>
```

### Game Info Minimap
```tsx
<div className="flex-column gap-xs">
  <h2 className={cn(styles.gameInfoMinimap, 'm-0 text-md')}>
    {gameTitle}
  </h2>
  <p className={cn(styles.gameInfoMinimap, 'm-0 text-xs')}>
    {gameStatus}
  </p>
</div>
```

### Score Display
```tsx
<div className={cn(
  styles.scoreDisplay,
  'gap-lg py-sm px-md rounded-md'
)}>
```

### Score Team
```tsx
<div className="gap-sm">
  <span className="font-semibold text-secondary">
    {teamName}
  </span>
  <span className={cn(styles.teamScore, 'text-xl font-bold')}>
    {score}
  </span>
</div>
```

### Main Content
```tsx
<div className={cn(
  styles.mainContent,
  'p-lg relative overflow-hidden'
)}>
```

### Diamond Container
```tsx
<div className={cn(
  styles.diamondContainer,
  'relative mx-auto'
)}>
```

### Player Positions
```tsx
<div className={cn(
  styles.player,
  styles.playerNorth, // Keep position-specific class
  'absolute flex-column-center gap-md'
)}>
```

### Play Area
```tsx
<div className={cn(
  styles.playArea,
  'absolute-center flex-center rounded-lg'
)}>
```

### Played Dominoes Grid
```tsx
<div className="grid grid-cols-2 gap-md p-md">
  {playedDominoes}
</div>
```

### Bidding Container
```tsx
<div className={cn(
  styles.biddingContainer,
  'absolute-center bg-surface rounded-lg shadow-xl p-xl'
)}>
```

### Game Info
```tsx
<div className="flex-column gap-xs">
  <h2 className="m-0 text-xl">{title}</h2>
  <p className="m-0 text-secondary text-sm">{description}</p>
</div>
```

### Status Message
```tsx
<div className={cn(
  styles.statusMessage,
  'absolute py-sm px-lg rounded-md shadow-lg text-lg'
)}>
```

## Responsive Overrides

For responsive design, you'll need to conditionally apply different utility classes based on screen size. This can be done with:

1. Custom responsive utility classes (if available)
2. JavaScript-based responsive hooks
3. CSS-in-JS solutions
4. Keep responsive overrides in CSS modules

## Benefits of This Refactoring

1. **Reduced CSS file size**: Removed ~150 lines of redundant CSS
2. **Better consistency**: Using shared utility classes ensures consistent spacing and styling
3. **Easier maintenance**: Changes to design tokens automatically propagate
4. **Improved DX**: Developers can see styles directly in JSX
5. **Better performance**: Shared utility classes are cached better by browsers

## Migration Steps

1. Import the utility classes in your component
2. Add the utility classes alongside existing module classes using `cn()` or `clsx()`
3. Test that styling remains the same
4. Remove the redundant CSS from the module file
5. Update any dynamic class applications

## Notes

- The `cn()` function is assumed to be a className utility (like clsx)
- Some utilities like `absolute-center` and `flex-column-center` are custom composite utilities
- Design token values are preserved for custom properties
- Complex selectors and pseudo-classes remain in the CSS module