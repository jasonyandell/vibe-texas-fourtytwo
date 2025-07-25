# Unused CSS Classes to Remove

After analyzing the codebase, the following utility classes are completely unused and can be safely removed:

## Layout Utilities (`utilities/layout.css`)
- `.flex-wrap-center` (lines 47-52)
- `.flex-space-around` (lines 86-89)
- `.flex-space-evenly` (lines 91-94)
- `.grid-cols-5` (line 143)
- `.grid-cols-6` (line 144)
- `.grid-rows-2` (line 147)
- `.grid-rows-3` (line 148)
- `.grid-rows-4` (line 149)

## Interactive Utilities (`utilities/interactive.css`)
- `.cursor-wait` (line ~60)
- `.cursor-help` (line ~61)
- `.cursor-grab` (line ~62)
- `.cursor-grabbing` (line ~63)

## Effects Utilities (`utilities/effects.css`)
- `.backdrop-blur-sm`
- `.backdrop-blur-lg`

## Position Utilities (`utilities/display.css`)
- `.sticky`
- `.static`

## Total Impact
Removing these ~16 unused utility classes would reduce the CSS bundle size and improve maintainability.

## Recommendation
These can be removed in a future cleanup task. If any of these utilities are needed in the future, they can be added back from the Git history.