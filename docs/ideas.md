replay feature.  after a game is complete, add a button to replay the game.  this will use the URL serialization to replay the game.  it will step through each move and display the game state at each step.  it will also display the trick history and the trick winner.  it will also display the scores and the marks.  it will also display the trump suit and the bidder.  it will also display the dealer and the current player.  it will also display the game phase.  it will also display the game status

suggest system. when the game does something unexpected, allow users to add a suggestion.  track the suggestions in ???? and create a script to turn those suggestions into stories

github integration.  just go full github integration. stories and tasks and branches and just go for it

convert stories/ into github issues.  change the titles from the file name to an appropriate name.    
for `*plan*md`, make a project board. give the project a good summary name, not necessarily relatead to what the plan filenames are. the goal is to be able to give the instruction "in the [x] project, implement the first incomplete story"

design check in - gap analysis and implementation plan to align with design

simplify. simplify. simplify.

figma export/modify/import

use canonical 42 names for internal game concepts (no baseball diamond, no NSEW)

ai players.  personalities.  first personality is "robot" and it plays the best it can, given the odds.  other personalities might include 
- "aggressive", which bids more often
- "conservative", which plays defensively
- "low" which goes low more often
ai player custom personalities
- gather possible personality parameters
- allow a user to tweak those parameters to create a custom personality
- add a low-cost LLM agent to help translate user desires to personality parameters

ai player community learning
- when replaying a game, allow user to "like" a move
- periodically run a script to analyze the liked moves and adjust the personalities accordingly
- allow user to add custom reasoning for a move, "I would have/should have played X here because ..."
- allow user to "dislike" a move
, which is also fed into the LLM to adjust the personalities