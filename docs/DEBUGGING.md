# Debugging Guide

This guide helps you troubleshoot common issues when developing the Texas 42 web game.

## 🚨 Common Issues

### Prerequisites Issues

#### Node.js Version Mismatch
**Problem**: `npm run check-prereqs` fails with Node.js version error
```
✗ Node.js 16.14.0 is below minimum 18.0.0
```

**Solution**:
1. Install Node.js 18+ from [nodejs.org](https://nodejs.org/)
2. Use a Node version manager:
   ```bash
   # Using nvm (macOS/Linux)
   nvm install 18
   nvm use 18
   
   # Using nvm-windows (Windows)
   nvm install 18.0.0
   nvm use 18.0.0
   ```

#### Docker Not Running
**Problem**: `npm start` fails with Docker connection error
```
✗ Docker daemon is not running. Please start Docker Desktop.
```

**Solution**:
1. Start Docker Desktop application
2. Wait for Docker to fully initialize
3. Verify with: `docker info`

#### npm Version Issues
**Problem**: Workspace commands fail
```
npm ERR! Workspaces not supported
```

**Solution**:
1. Update npm: `npm install -g npm@latest`
2. Verify version: `npm --version` (should be 9+)

### Port Conflicts

#### Port Already in Use
**Problem**: Server fails to start
```
Error: listen EADDRINUSE: address already in use :::4200
```

**Solution**:
1. **Find the process using the port**:
   ```bash
   # macOS/Linux
   lsof -i :4200
   
   # Windows
   netstat -ano | findstr :4200
   ```

2. **Kill the process**:
   ```bash
   # macOS/Linux
   kill -9 <PID>
   
   # Windows
   taskkill /PID <PID> /F
   ```

3. **Or change the port**:
   ```bash
   # In .env file
   FRONTEND_PORT=4300
   BACKEND_PORT=4301
   DATABASE_PORT=5434
   ```

### Environment Configuration

#### Missing Environment Files
**Problem**: Application fails to start with missing config
```
Error: DATABASE_URL is required
```

**Solution**:
1. Run environment setup: `npm run setup-env`
2. Manually copy `.env.example` files:
   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

#### Invalid Database Connection
**Problem**: Backend fails to connect to database
```
Error: connect ECONNREFUSED 127.0.0.1:5433
```

**Solution**:
1. Ensure database is running: `docker-compose -f docker-compose.db.yml up`
2. Check database logs: `docker logs texas42-db-dev`
3. Verify connection string in `backend/.env`

### Development Server Issues

#### Frontend Hot Reload Not Working
**Problem**: Changes don't reflect in browser

**Solution**:
1. Check Vite dev server is running on correct port
2. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
3. Restart dev server: `npm run dev:frontend`
4. Check for TypeScript errors in console

#### Backend API Not Responding
**Problem**: Frontend can't connect to backend API

**Solution**:
1. Verify backend is running: `curl http://localhost:4201/api/health`
2. Check CORS configuration in backend
3. Verify proxy configuration in `vite.config.ts`
4. Check backend logs for errors

### Testing Issues

#### Playwright Tests Failing
**Problem**: E2E tests fail to start or connect

**Solution**:
1. Install Playwright browsers: `npx playwright install`
2. Ensure dev servers are running before tests
3. Check port configuration in `playwright.config.ts`
4. Run tests in headed mode for debugging: `npm run test:e2e -- --headed`

#### Vitest Tests Not Running
**Problem**: Unit tests fail to execute

**Solution**:
1. Check test file naming: `*.test.ts` or `*.spec.ts`
2. Verify test setup files exist
3. Clear Vitest cache: `npx vitest run --reporter=verbose --no-cache`
4. Check for TypeScript compilation errors

### Database Issues

#### PostgreSQL Connection Refused
**Problem**: Cannot connect to PostgreSQL

**Solution**:
1. Check if PostgreSQL container is running:
   ```bash
   docker ps | grep postgres
   ```
2. Check container logs:
   ```bash
   docker logs texas42-db-dev
   ```
3. Verify port mapping in docker-compose files
4. Test connection manually:
   ```bash
   psql -h localhost -p 5433 -U texas42_user -d texas42_dev
   ```

#### Database Schema Issues
**Problem**: Tables don't exist or schema is outdated

**Solution**:
1. Recreate database container:
   ```bash
   docker-compose -f docker-compose.db.yml down -v
   docker-compose -f docker-compose.db.yml up
   ```
2. Run migrations: `npm run --workspace=backend db:migrate`
3. Check SQL init files in `backend/sql/init/`

### Build Issues

#### TypeScript Compilation Errors
**Problem**: Build fails with TypeScript errors

**Solution**:
1. Check for type errors: `npm run type-check`
2. Update TypeScript: `npm install typescript@latest`
3. Clear TypeScript cache: `rm -rf node_modules/.cache`
4. Restart TypeScript service in IDE

#### Vite Build Failures
**Problem**: Frontend build fails

**Solution**:
1. Clear Vite cache: `rm -rf frontend/node_modules/.vite`
2. Check for import path issues
3. Verify all dependencies are installed
4. Build with verbose output: `npm run build:frontend -- --debug`

## 🔧 Debugging Tools

### Frontend Debugging

#### Browser DevTools
- **React DevTools**: Install browser extension
- **Network Tab**: Monitor API calls
- **Console**: Check for JavaScript errors
- **Sources**: Set breakpoints in TypeScript

#### Vite Debugging
```bash
# Start with debug output
DEBUG=vite:* npm run dev:frontend

# Check Vite config
npx vite --debug
```

### Backend Debugging

#### Node.js Inspector
```bash
# Start backend with inspector
node --inspect-brk dist/index.js

# Or with tsx for TypeScript
npx tsx --inspect-brk src/index.ts
```

#### Logging
- Check backend logs in console
- Adjust log level in `.env`: `LOG_LEVEL=debug`
- Use structured logging for debugging

#### Database Debugging
```bash
# Access PostgreSQL directly
docker exec -it texas42-db-dev psql -U texas42_user -d texas42_dev

# View database logs
docker logs texas42-db-dev

# Access pgAdmin (if enabled)
# http://localhost:5050
```

### Network Debugging

#### API Testing
```bash
# Test backend health
curl http://localhost:4201/api/health

# Test with verbose output
curl -v http://localhost:4201/api/games

# Test WebSocket connection
wscat -c ws://localhost:4201/api/games/test/ws
```

## 🆘 Getting Help

### Check Logs
1. **Frontend**: Browser console and network tab
2. **Backend**: Terminal output where backend is running
3. **Database**: `docker logs texas42-db-dev`
4. **Docker**: `docker-compose logs`

### Clean Slate Approach
If all else fails, start fresh:

```bash
# Stop all services
docker-compose down -v
npm run cleanup

# Reinstall dependencies
npm install

# Recreate environment
npm run setup-env

# Start fresh
npm run develop
```

### Performance Issues

#### Slow Development Server
- Check available system resources
- Close unnecessary applications
- Use `npm run develop` instead of `npm start`
- Disable source maps temporarily

#### Memory Issues
- Increase Node.js memory: `NODE_OPTIONS="--max-old-space-size=4096"`
- Close browser tabs
- Restart development servers periodically

### Windows PowerShell Issues

#### Unicode Emoji Encoding Errors
**Problem**: PowerShell scripts fail with Unicode emoji characters
```
Cannot process argument because the value of argument "name" is not valid
```

**Solution**:
Replace Unicode emojis with plain text in PowerShell scripts:
```powershell
# Instead of: "📋 Backlog", "🚧 In Progress"
# Use: "Backlog", "In Progress"
$workableStatuses = @("Backlog", "In Progress")
```

#### PowerShell Function Parameter Syntax
**Problem**: PowerShell function calls fail with parameter binding errors
```
A parameter cannot be found that matches parameter name
```

**Solution**:
Use proper PowerShell function syntax:
```powershell
# Correct syntax
function Write-TestResult {
    param([bool]$success, [string]$message)
    # function body
}

# Call with proper parameters
Write-TestResult -success $true -message "Test passed"
```

#### GitHub CLI JSON Parsing
**Problem**: Complex JSON parsing fails in PowerShell one-liners

**Solution**:
Break complex operations into multiple steps:
```powershell
# Instead of complex one-liner, use step-by-step approach
$projectData = gh project item-list 2 --owner jasonyandell --format json | ConvertFrom-Json
$e2eIssues = $projectData.items | Where-Object { $_.labels -contains "e2e-tests" }
$sortedIssues = $e2eIssues | Sort-Object Priority, Number
```

### Automated Workflow Issues

#### GitHub Project API Rate Limits
**Problem**: Frequent project queries hit API rate limits

**Solution**:
1. Cache project data when possible
2. Use `gh auth status` to check authentication
3. Implement retry logic with exponential backoff
4. Consider using GitHub tokens with higher rate limits

#### Branch Detection False Positives
**Problem**: Branch detection finds unrelated branches

**Solution**:
Use more specific patterns:
```powershell
# More specific pattern matching
$branchPattern = "*fix-e2e-$issueNumber-*"
$branchExists = git branch --list $branchPattern
```

## 📞 Support

If you're still experiencing issues:

1. Check the [GitHub Issues](repository-url/issues)
2. Search for similar problems
3. Create a new issue with:
   - Operating system and version
   - Node.js and npm versions
   - Complete error messages
   - Steps to reproduce
   - What you've already tried

## 🔍 Useful Commands

```bash
# System information
node --version
npm --version
docker --version
docker-compose --version

# Project status
npm run check-prereqs
docker ps
npm ls --workspaces

# Cleanup and reset
npm run cleanup
docker system prune
npm cache clean --force
```
