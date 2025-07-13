# Feature Flags Design (Future Implementation)

This document consolidates all feature flag design concepts extracted from the project documentation. These designs are preserved for future consideration but are not part of the current project scope.

---

## Table of Contents

1. [Core Feature Flag Philosophy](#1-core-feature-flag-philosophy)
2. [Hierarchical Flag System](#2-hierarchical-flag-system)
3. [Frontend Implementation](#3-frontend-implementation)
4. [Backend Implementation](#4-backend-implementation)
5. [URL Override Mechanisms](#5-url-override-mechanisms)
6. [Configuration Management](#6-configuration-management)
7. [Testing with Feature Flags](#7-testing-with-feature-flags)
8. [Deployment Strategy](#8-deployment-strategy)

---

## 1. Core Feature Flag Philosophy

### 1.1 Safe Deployment Principle
- **CRITICAL**: Deploy at any time with no user-visible changes without flag changes
- **All features developed "flag off"** by default
- **Default State**: With no flags enabled, nothing happens
- **Safe Deployment**: Feature flags enable decoupled, risk-free deployments

### 1.2 Flag Management Strategy
- Flags can be toggled with simple overrides (including query parameters)
- Flags should be grouped hierarchically for related features
- Managing and maintaining flags is a critical part of the system
- All features are developed "flag off" initially

---

## 2. Hierarchical Flag System

### 2.1 Flag Hierarchy Design
```typescript
interface FeatureFlags {
  // Individual feature flags
  lobby: boolean;
  game: boolean;
  createGame: boolean;
  spectatorMode: boolean;
  
  // Hierarchical flags (enable multiple features)
  'v1.0.0': boolean; // Enables lobby + game
  'v1.1.0': boolean; // Enables lobby + game + createGame + spectatorMode
}
```

### 2.2 Hierarchical Logic
- **v1.1.0 flag**: Enables all features (lobby, game, createGame, spectatorMode)
- **v1.0.0 flag**: Enables core features (lobby, game)
- **Individual flags**: Can be enabled independently for granular control
- **Precedence**: Hierarchical flags take precedence over individual flags

### 2.3 Example Usage
```typescript
const isEnabled = (feature: string) => {
  // Check hierarchical flags first
  if (flags['v1.1.0'] && ['lobby', 'game', 'createGame', 'spectatorMode'].includes(feature)) {
    return true;
  }
  if (flags['v1.0.0'] && ['lobby', 'game'].includes(feature)) {
    return true;
  }
  
  return flags[feature as keyof FeatureFlags] || false;
};
```

---

## 3. Frontend Implementation

### 3.1 Feature Flag Provider
```typescript
function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    // Read from environment and URL params
    const urlParams = new URLSearchParams(window.location.search);
    const envFlags = {
      lobby: import.meta.env.VITE_FEATURE_LOBBY === 'true',
      game: import.meta.env.VITE_FEATURE_GAME === 'true',
      createGame: import.meta.env.VITE_FEATURE_CREATE_GAME === 'true',
      spectatorMode: import.meta.env.VITE_FEATURE_SPECTATOR === 'true',
      'v1.0.0': import.meta.env.VITE_FEATURE_V1_0_0 === 'true',
      'v1.1.0': import.meta.env.VITE_FEATURE_V1_1_0 === 'true',
    };
    
    // URL overrides
    const urlOverrides = Object.fromEntries(
      Array.from(urlParams.entries())
        .filter(([key]) => key.startsWith('flag_'))
        .map(([key, value]) => [key.replace('flag_', ''), value === 'true'])
    );
    
    return { ...envFlags, ...urlOverrides };
  });
  
  const isEnabled = useCallback((feature: string) => {
    // Hierarchical logic implementation
    if (flags['v1.1.0'] && ['lobby', 'game', 'createGame', 'spectatorMode'].includes(feature)) {
      return true;
    }
    if (flags['v1.0.0'] && ['lobby', 'game'].includes(feature)) {
      return true;
    }
    
    return flags[feature as keyof FeatureFlags] || false;
  }, [flags]);
  
  return (
    <FeatureFlagContext.Provider value={{ flags, setFlags, isEnabled }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}
```

### 3.2 Component-Level Gating
```typescript
// Page-level gating
function LobbyPage() {
  const { isEnabled } = useFeatureFlags();
  
  if (!isEnabled('lobby')) {
    return <ComingSoon feature="lobby" />;
  }
  
  return (
    <div>
      <LobbyList />
      <FeatureGate feature="createGame">
        <CreateGameButton />
      </FeatureGate>
    </div>
  );
}

// Hook-level gating
function useLobbyActions() {
  const { isEnabled } = useFeatureFlags();
  
  return {
    joinGame: isEnabled('lobby') ? actualJoinGame : () => {},
    createGame: isEnabled('createGame') ? actualCreateGame : () => {},
  };
}
```

### 3.3 FeatureGate Component
```typescript
interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  const { isEnabled } = useFeatureFlags();
  
  return isEnabled(feature) ? <>{children}</> : <>{fallback}</>;
}
```

---

## 4. Backend Implementation

### 4.1 Feature Flag Plugin
```typescript
interface FeatureFlags {
  lobby: boolean;
  game: boolean;
  createGame: boolean;
  spectatorMode: boolean;
}

export function createFeatureFlagPlugin() {
  return async function featureFlagPlugin(fastify: FastifyInstance) {
    const flags: FeatureFlags = {
      lobby: process.env.FEATURE_LOBBY === 'true',
      game: process.env.FEATURE_GAME === 'true',
      createGame: process.env.FEATURE_CREATE_GAME === 'true',
      spectatorMode: process.env.FEATURE_SPECTATOR === 'true',
    };
    
    fastify.decorate('featureFlags', flags);
    
    fastify.addHook('preHandler', async (request, reply) => {
      request.featureFlags = flags;
    });
  };
}
```

### 4.2 Route-Level Gating
```typescript
// Protect routes with feature flags
fastify.get('/api/lobbies', {
  preHandler: async (request, reply) => {
    if (!request.featureFlags.lobby) {
      reply.code(404).send({ error: 'Feature not available' });
    }
  }
}, async (request, reply) => {
  // Lobby logic here
});
```

---

## 5. URL Override Mechanisms

### 5.1 URL Parameter Format
- **Individual flags**: `?flag_lobby=true&flag_game=true`
- **Hierarchical flags**: `?flag_v1.0.0=true` (enables multiple features)
- **Development convenience**: `?flag_v1.1.0=true` (enables all features)

### 5.2 Implementation Pattern
```typescript
// Extract flags from URL
const urlParams = new URLSearchParams(window.location.search);
const flagOverrides = Object.fromEntries(
  Array.from(urlParams.entries())
    .filter(([key]) => key.startsWith('flag_'))
    .map(([key, value]) => [key.replace('flag_', ''), value === 'true'])
);

// Merge with environment flags
const finalFlags = { ...envFlags, ...flagOverrides };
```

---

## 6. Configuration Management

### 6.1 Frontend Environment Variables
```env
# Feature Flags (can be overridden via URL params)
VITE_FEATURE_LOBBY=false
VITE_FEATURE_GAME=false
VITE_FEATURE_CREATE_GAME=false
VITE_FEATURE_SPECTATOR=false

# Hierarchical flags
VITE_FEATURE_V1_0_0=false
VITE_FEATURE_V1_1_0=false
```

### 6.2 Backend Environment Variables
```env
# Feature Flags
FEATURE_LOBBY=false
FEATURE_GAME=false
FEATURE_CREATE_GAME=false
FEATURE_SPECTATOR=false

# Hierarchical flags
FEATURE_V1_0_0=false
FEATURE_V1_1_0=false
```

---

## 7. Testing with Feature Flags

### 7.1 Component Testing
```typescript
describe('LobbyPage', () => {
  it('shows coming soon when lobby flag is disabled', () => {
    render(
      <FeatureFlagProvider initialFlags={{ lobby: false }}>
        <LobbyPage />
      </FeatureFlagProvider>
    );
    
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });
  
  it('shows lobby list when lobby flag is enabled', () => {
    render(
      <FeatureFlagProvider initialFlags={{ lobby: true }}>
        <LobbyPage />
      </FeatureFlagProvider>
    );
    
    expect(screen.getByTestId('lobby-list')).toBeInTheDocument();
  });
});
```

### 7.2 End-to-End Testing
```typescript
test('complete game flow with flags', async ({ page }) => {
  // Enable all features via URL
  await page.goto('/?flag_v1.1.0=true');
  
  // Test full functionality
  await page.click('[data-testid="empty-slot"]');
  await page.click('[data-testid="ready-button"]');
  await page.click('[data-testid="domino-6-6"]');
  
  await expect(page.locator('[data-testid="current-trick"]')).toContainText('6-6');
});
```

---

## 8. Deployment Strategy

### 8.1 Safe Deployment Process
1. **Deploy with flags off**: New features deployed but not visible
2. **Test in production**: Use URL overrides to test features
3. **Gradual rollout**: Enable flags for specific users/environments
4. **Full release**: Enable flags for all users
5. **Flag cleanup**: Remove flags once features are stable

### 8.2 Flag Lifecycle Management
- **Development**: All flags off by default
- **Testing**: Enable via URL parameters
- **Staging**: Test with various flag combinations
- **Production**: Controlled flag enablement
- **Cleanup**: Remove obsolete flags after stable release

---

## Implementation Notes

This feature flag system was designed to enable:
- **Risk-free deployments** with features hidden behind flags
- **Gradual feature rollouts** with hierarchical flag control
- **Easy development testing** via URL parameter overrides
- **Clean separation** between feature development and release

The system supports both individual feature control and grouped feature releases through hierarchical flags, providing maximum flexibility for deployment strategies while maintaining simplicity for developers.
