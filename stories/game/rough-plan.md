init claude code
merge stuff from demo
start plan for implementing game plays one by one

# the plan
- we will work on stories/game/game-flows.md one by one
- analyze the story
- analyze the context
- planning phase:
    The planning phase will analyze and document the work into a plan folder
    It will do its work in the "plan folder": stories/game/{story-number}-{short-description}/ eg stories/game/001-base-game-state/
    It will reference
        - the story
        - `stories/game/TESTING_OVERVIEW.md` 
    - prep
        - if the plan folder doesn't exist, continue
        - if the plan folder does exist, review its contents, discover what step you are on and continue from there
    - analyze, breakdown and document
        - write a detailed plan to implement to that directory as {short-description-overview}.md
        - break that {short-description-overview}.md into tasks
        - write those tasks to {short-description}-tasks-{task-number}.md.  
            - tasks should be simple and human readable
            - provide information the implementer will need
            - do research to find starting-point context for the implementor, eg known files, how to run things
            - explicitly exclude code blocks in the tasks. the tasks should outline what needs doing and clear definition of done, but no code
    - simplify
        - read the tasks in the stories directory and simplify them
        - we want to break these tasks into ~1hr of human work
        - are we doing too much? break the task up into new task mds
    - present
        - read the tasks a directory and create a work overivew document in that directory that describes what will be done
        - identify which parts can be done in parallel
        - make sure the plan folder contains only the latest documents (clean up any non-latest documents)
- implementaton phase
    - start an orchestrator. the orchestrator's job is to implement the tasks as subagents. the orchestrator updates the plan folder with the current status. implementation.md
    - the orchestrator will read the work overview document and start implementors as subagents for each task
    - implementors:
        - coding phase:
            - reference one and only one detailed task and implement it
            - red/green/refactor
            - during refactor, ensure tests pass, lint passes, types pass. all warnings are blockers
        - critical review and simplification phase:
            - look at what was implemented
            - as subtasks:
                - analyze it to dijkstra-review.md as if you were Edsger Dijkstra. be critical and unwilling to accept mediocrity
                - analyze it to karen-review.md as if you were a Karen that is hostile to change and demanding of simplification
                - analyze it to kid-review.md as if you were a 5 year old.  is it simple enough for a 5 year old to understand?
            - read those subtasks and create a simplify-plan.md file to address the feedback. 
            - implement simplify-plan.md.  follow red/green/refactor and all warnings are blockers
        - documentation phase:
            - summarize all tests and update `stories/game/TESTING_OVERVIEW.md` with the test titles (given when thens)


