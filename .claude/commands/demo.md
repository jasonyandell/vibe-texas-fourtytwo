---
description: Update demo page and create video
allowed-tools: [Read, Write, Edit, Bash]
---
# Demo for Current Story

## 1. Update Demo Index
Edit `frontend/src/demo/index.tsx` to add the new story.

## 2. Create Story Demo Page
Create `frontend/src/demo/story-$ARGUMENTS.tsx` with interactive example.

## 3. Test Demo Manually
```bash
npm run dev:frontend
# Navigate to /demo
```

## 4. Create Demo Video
```bash
# Use E2E test to create video
story_dir=$(find stories/game -name "STATUS.md" -exec grep -l "Story $ARGUMENTS" {} \; | head -1 | xargs dirname)
npm run test:e2e -- "$story_dir/e2e.spec.ts" --video=on

# Copy video
cp test-results/*/video.webm "$story_dir/demo.mp4"
```

## 5. Commit Demo
```bash
git add frontend/src/demo/
git add stories/game/*/demo.mp4
git commit -m "demo: Add demo for story $ARGUMENTS"
```