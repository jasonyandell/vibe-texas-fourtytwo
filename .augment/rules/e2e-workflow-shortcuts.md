# E2E Workflow Shortcuts

## Quick Commands

When the user types any of these commands, immediately execute the E2E workflow:

### Trigger Phrases
- "work e2e queue"
- "e2e workflow"
- "next e2e task"
- "e2e queue"
- "work e2e"

### Action to Take
When you see any of the trigger phrases above, immediately execute this workflow:

```
Continue E2E Test Project workflow. Execute the next single task:

1. Query GitHub Project #2 state: gh project item-list 2 --owner jasonyandell --format json
2. Check for approved PRs to merge
3. Check for PRs with blocking comments to fix  
4. Check for unreviewed PRs to review
5. Work on next priority issue from project board (only "Backlog" or "In Progress" status)

Execute ONLY ONE task and stop. Use Windows-compatible commands.

Follow the workflow in READY_TO_USE_E2E_PROMPT.md for detailed instructions.
```

### Workflow Rules
- Execute EXACTLY ONE task per session
- Always query the project board state first
- Prioritize PRs over new issues
- Use Windows-compatible PowerShell commands
- Stop after completing one task and ask user to run the command again

### Project Context
- GitHub Project #2 is "E2E Test Fixes"
- Issues are labeled with "e2e-tests"
- Priority order: priority-1-critical → priority-2-high → priority-3-medium → priority-4-low → priority-5-later
- Only work on issues with status "Backlog" or "In Progress"

## Example Usage

User types: "work e2e queue"
You respond: Execute the E2E workflow immediately, starting with querying the project board state.

User types: "next e2e task"  
You respond: Execute the E2E workflow immediately, continuing from where the last task left off.

## Important Notes
- Do NOT ask for confirmation when these trigger phrases are used
- Do NOT explain what you're going to do - just start executing
- These are shortcuts for immediate action
- Always follow the single-task execution model
