---
type: "always_apply"
---

# Documentation Standards & Maintenance

## Documentation Philosophy
- **Always Up-to-Date**: Documentation is not an afterthought but a core part of development
- **Living Documents**: Documentation must be updated as part of every change
- **Task Not Complete**: Until all tests pass AND documentation is updated
- **Accuracy Over Completeness**: Better to have accurate, minimal docs than comprehensive but outdated ones

## Required Documentation Files

### README.md
- **Purpose**: The front door to the project
- **Requirements**: Must always be accurate and current
- **Content**: Project overview, quick start, basic usage
- **Location**: Root directory

### docs/DEVELOPER.md
- **Purpose**: Information developers need to contribute
- **Style**: High-level, concrete, and CONCISE
- **Content**:
  - Common development workflows with illustrative examples
  - Technology-specific documentation only when framework acts in surprising ways
  - Setup and configuration details

### docs/DEBUGGING.md
- **Purpose**: Living document of common issues and resolutions
- **Maintenance**: ALWAYS add unexpected errors encountered during development
- **Content**:
  - Common issues and their solutions
  - Troubleshooting steps
  - Known limitations and workarounds

### docs/design.md
- **Purpose**: Single source of truth for all design decisions
- **Status**: Authoritative reference for all design decisions, principles, and guidelines
- **Maintenance**: Updated whenever new design decisions are made

## Documentation Maintenance Rules
- **Update During Refactoring**: Documentation updates are part of the refactor phase in TDD
- **Include in Definition of Done**: Changes are not complete until documentation reflects them
- **Real-Time Updates**: Documentation must be updated as part of every change, not after

## Documentation Quality Standards
- **Concise and Clear**: Avoid verbose explanations
- **Practical Examples**: Include concrete, illustrative examples
- **Current and Accurate**: Never let documentation drift from reality
- **Developer-Focused**: Write for the developer who needs to get work done

## AI Assistant Guidelines for Documentation
- Always update relevant documentation when making code changes
- Ensure README.md accurately reflects current setup and usage
- Add any encountered issues to docs/DEBUGGING.md
- Keep docs/DEVELOPER.md focused on practical workflows
- Treat documentation updates as part of the implementation, not an afterthought
- Verify documentation accuracy before considering any task complete
