# Texas 42 Game-Specific Requirements

## Game State Management Requirements

### Complete Serialization
- **All game state must be serializable to a single compact string**
- **URL-Compatible**: Serialized state must be small enough for GET parameters
- **JSON Deserializable**: Must deserialize back to simple JSON
- **Self-Contained**: Game state is separate from lobby state and knows only about the game

### Game State Components
Game state includes but is not limited to:
- **Player Information**: Who has which dominoes, who bid what
- **Partnerships**: Partners always sit across from each other
- **Trick History**: For each partnership, what tricks caught and who played what
- **Turn Management**: Whose turn it is currently
- **Scoring**: Current game score and trick score (points earned by tricks)
- **Game Flow**: Who shuffled last

## UI/UX Requirements

### Visual Design
- **Real double-6 domino visuals**: Authentic domino appearance
- **Baseball diamond layout**: Players arranged in diamond formation
- **Clean, responsive UI**: Works on desktop and mobile
- **Intuitive game flow**: Clear indication of whose turn it is

### User Experience
- **Fast, responsive interactions**: No lag in game actions
- **Clear game state visibility**: Players can easily see current state
- **Error prevention**: UI prevents invalid moves
- **Accessibility**: Keyboard navigation and screen reader support

## Game Logic Requirements

### Core Game Rules (Texas 42)
- **Double-6 dominoes**: Standard set of 28 dominoes
- **4 players in partnerships**: Partners sit across from each other
- **Bidding phase**: Players bid on tricks they can take
- **Trick-taking gameplay**: Follow suit rules, trump suit mechanics
- **Scoring system**: Points based on tricks taken and specific dominoes

### Technical Implementation
- **Turn flow validation**: Ensure proper turn order
- **Trick validation**: Verify legal plays according to rules
- **Score calculation**: Accurate point tracking
- **Game state transitions**: Proper phase management (bidding, playing, scoring)

## Separation of Concerns

### Lobby vs Game State
- **Lobby State**: Handles player joining/leaving, room management
- **Game State**: Only contains information about current game in progress
- **Clear Boundaries**: Each component has well-defined responsibilities
- **No Mixing**: Game logic doesn't handle lobby concerns and vice versa

## AI Assistant Guidelines for Game Development
- Always maintain clear separation between lobby and game state
- Ensure game state is always serializable and URL-compatible
- Implement authentic Texas 42 rules and scoring
- Prioritize responsive, intuitive UI for game interactions
- Validate all game actions according to Texas 42 rules
- Keep game state compact and efficient for URL serialization
