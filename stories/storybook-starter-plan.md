# Storybook Starter Plan - Minimal Setup

## Goal
Get Storybook running with just `DominoComponent` and `DominoHand` to evaluate the developer experience. No bells and whistles - just the core value proposition.

## Quick Start (30 minutes)

### Step 1: Install Storybook
```bash
cd frontend
npx storybook@latest init --skip-install
npm install
```

### Step 2: Clean Up Defaults
- Delete example stories in `src/stories/`
- Keep `.storybook/` configuration as-is

### Step 3: Create Two Stories

#### DominoComponent.stories.tsx
Location: `frontend/src/components/DominoComponent.stories.tsx`

Structure:
```
- Default (single domino 6-4)
- All28Dominoes (visual reference)
- Orientations (horizontal/vertical)
- InteractiveStates (normal/selected/highlighted)
- CountDominoes (the 5 counting dominoes)
```

#### DominoHand.stories.tsx
Location: `frontend/src/components/DominoHand.stories.tsx`

Structure:
```
- Default (7 random dominoes)
- EmptyHand
- WithSelection (some selected)
- AllCountDominoes (hand with all 5 count dominoes)
- InteractionDemo (click to select)
```

### Step 4: Run It
```bash
npm run storybook
```

## Story Structure Pattern

Each story file follows this pattern:

1. **Meta Configuration**
   - Component reference
   - Title (hierarchical: "Game/DominoComponent")
   - Basic argTypes for props

2. **Stories as Test Cases**
   - Each story represents a test scenario
   - Story names describe the scenario
   - Args provide the test data

3. **Minimal Decorators**
   - Just wrap in a div with padding
   - No providers or contexts yet

## Test Description Integration

### Current State
Your tests use describe blocks with given/when/then patterns. To surface these in Storybook:

### Simple Approach (Do This First)
1. **Story Naming**: Match test descriptions
   ```
   // Test: "given a domino with values 6 and 4"
   // Story: "WithValues6And4"
   ```

2. **Story Descriptions**: Add JSDoc comments
   ```typescript
   /**
    * Given a domino with values 6 and 4
    * When rendered horizontally
    * Then displays correct pip layout
    */
   export const CountDomino: Story = {
     args: { topValue: 6, bottomValue: 4 }
   };
   ```

### Future Enhancement (Document for Later)
Create a test-story bridge utility:
```typescript
// utils/storybridge.ts
export function fromTest(testName: string, args: any) {
  return {
    name: testName.replace(/given|when|then/g, '').trim(),
    args,
    parameters: {
      docs: {
        description: {
          story: testName
        }
      }
    }
  };
}
```

This would allow importing test descriptions directly, but save this for after you validate the basic setup.

## File Organization

```
frontend/src/components/
├── DominoComponent/
│   ├── DominoComponent.tsx
│   ├── DominoComponent.test.tsx
│   ├── DominoComponent.stories.tsx    ← NEW
│   └── DominoComponent.module.css
└── DominoHand/
    ├── DominoHand.tsx
    ├── DominoHand.test.tsx
    ├── DominoHand.stories.tsx          ← NEW
    └── DominoHand.module.css
```

## What You'll See

### Storybook UI
- **Sidebar**: Hierarchical component tree
- **Canvas**: Component rendering
- **Controls**: Auto-generated prop controls
- **Docs**: Auto-generated documentation

### Developer Experience
1. **Hot Reload**: Change component, see update instantly
2. **Prop Playground**: Adjust props in real-time
3. **State Isolation**: Each story is independent
4. **Visual Testing**: See all states at once

## Success Criteria

You'll know it's working when:
1. Can see all 28 dominoes in a grid story
2. Can click dominoes in DominoHand story
3. Can toggle orientation via controls
4. Hot reload works on component changes
5. No console errors or warnings

## What's NOT Included

- ❌ Context providers
- ❌ Mock data factories  
- ❌ Addons beyond defaults
- ❌ CI/CD integration
- ❌ Visual regression testing
- ❌ Complex decorators
- ❌ Performance optimization

## Next Decision Points

After trying this starter setup, decide:

1. **Is it valuable?** Does it improve your workflow?
2. **Story granularity?** One story per test vs. grouped scenarios?
3. **Documentation?** How much detail in story descriptions?
4. **Test integration?** Share test data with stories?
5. **Team adoption?** Who else needs to use this?

## Common Issues & Fixes

### Issue: CSS Modules not working
- Storybook should auto-detect Vite config
- If not, check `.storybook/main.ts` for viteFinal config

### Issue: Import aliases not resolving
- Copy path mappings from `vite.config.ts` to `.storybook/main.ts`

### Issue: Component not rendering
- Check browser console for errors
- Verify component exports
- Ensure props are passed correctly

## Time Estimate

- Installation: 5 minutes
- First story: 10 minutes  
- Second story: 5 minutes
- Exploration: 10 minutes
- **Total: 30 minutes**

This gives you a working Storybook with your two most visual components. Once you see it in action, you can decide whether to expand to more components or keep your current demo approach.