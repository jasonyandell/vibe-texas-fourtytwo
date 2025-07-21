/**
 * Configuration for GitHub Projects
 */

export const CONFIG = {
  // Main development project
  mainProject: {
    title: "Texas 42 Development Board",
    description: "Main development tracking for Texas 42 Web Game stories and features",
    columns: [
      { name: "📋 Backlog", description: "Planned stories and features" },
      { name: "🚧 In Progress", description: "Currently being worked on" },
      { name: "👀 Review", description: "Ready for code review" },
      { name: "✅ Done", description: "Completed and merged" }
    ]
  },
  
  // E2E fixes project
  e2eProject: {
    title: "E2E Test Fixes",
    description: "Tracking E2E test fixes and improvements",
    columns: [
      { name: "📋 To Fix", description: "E2E tests that need fixing" },
      { name: "🔧 Fixing", description: "Currently being fixed" },
      { name: "✅ Fixed", description: "Tests now passing" }
    ]
  },

  // Rules research project
  rulesProject: {
    title: "Texas 42 Rules Research",
    description: "Research and validation of Texas 42 game rules",
    columns: [
      { name: "📚 Research", description: "Rules to research" },
      { name: "📝 Documenting", description: "Writing documentation" },
      { name: "✅ Complete", description: "Research complete" }
    ]
  }
};

export const projectMapping = {
  'rules': 3, // Texas 42 Rules Research
  'e2e-tests': 2, // E2E Test Fixes
  'story': 1, // Texas 42 Development Board
  'core-features': 1 // Also goes to main board
};