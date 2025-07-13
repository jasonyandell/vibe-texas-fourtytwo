# Story: GitHub Deployment Automation Setup

## Overview
Implement automated deployment pipeline using GitHub Actions to deploy the Texas 42 Web Game to production and staging environments. This story establishes continuous deployment workflows that automatically deploy successful builds from main branch and provide preview deployments for pull requests.

## User Story
**As a** development team  
**I want** automated deployment pipelines that deploy our application safely  
**So that** we can deliver features quickly while maintaining production stability

## Acceptance Criteria

### ✅ Production Deployment Pipeline
- [ ] Automatic deployment to production on main branch merges
- [ ] Production deployment only after all CI checks pass
- [ ] Database migration automation for production
- [ ] Production environment health checks after deployment
- [ ] Rollback capability for failed deployments

### ✅ Staging Environment Setup
- [ ] Staging environment mirrors production configuration
- [ ] Automatic deployment to staging on main branch pushes
- [ ] Staging database with test data seeding
- [ ] Staging environment accessible for testing and demos
- [ ] Independent staging environment that doesn't affect production

### ✅ Preview Deployments
- [ ] Preview deployments created for pull requests
- [ ] Preview environments automatically cleaned up when PR is closed
- [ ] Preview deployment URLs shared in PR comments
- [ ] Preview environments isolated from production data
- [ ] Preview deployments include full application stack

### ✅ Environment Management
- [ ] Environment-specific configuration management
- [ ] Secure secrets management for deployment credentials
- [ ] Environment variable management for different stages
- [ ] Database connection management across environments
- [ ] SSL/TLS certificate management

### ✅ Monitoring and Alerting
- [ ] Deployment status notifications to team
- [ ] Production health monitoring after deployments
- [ ] Error tracking and alerting for deployment failures
- [ ] Performance monitoring for deployed applications
- [ ] Automated rollback triggers for critical failures

## Technical Requirements

### Deployment Platform Options
**DECISION POINT:** Choose deployment platform:

**Option A: Cloud Platform (Recommended)**
- **Vercel** - Frontend deployment with serverless functions
- **Railway/Render** - Backend and database hosting
- **Pros:** Easy setup, automatic scaling, integrated CI/CD
- **Cons:** Platform lock-in, potential costs

**Option B: Container Platform**
- **Docker Hub + Cloud Run/ECS** - Container-based deployment
- **Pros:** Full control, portable, cost-effective
- **Cons:** More complex setup, infrastructure management

**Option C: Traditional VPS**
- **DigitalOcean/Linode** - Virtual private server deployment
- **Pros:** Full control, predictable costs
- **Cons:** Manual infrastructure management, scaling complexity

### Environment Configuration
**Production Environment:**
```yaml
# Environment Variables
NODE_ENV=production
DATABASE_URL=[PLACEHOLDER: PRODUCTION_DB_URL]
FRONTEND_URL=[PLACEHOLDER: PRODUCTION_FRONTEND_URL]
BACKEND_URL=[PLACEHOLDER: PRODUCTION_BACKEND_URL]
JWT_SECRET=[PLACEHOLDER: PRODUCTION_JWT_SECRET]
REDIS_URL=[PLACEHOLDER: PRODUCTION_REDIS_URL]
```

**Staging Environment:**
```yaml
# Environment Variables
NODE_ENV=staging
DATABASE_URL=[PLACEHOLDER: STAGING_DB_URL]
FRONTEND_URL=[PLACEHOLDER: STAGING_FRONTEND_URL]
BACKEND_URL=[PLACEHOLDER: STAGING_BACKEND_URL]
JWT_SECRET=[PLACEHOLDER: STAGING_JWT_SECRET]
REDIS_URL=[PLACEHOLDER: STAGING_REDIS_URL]
```

### GitHub Actions Deployment Workflow
Create `.github/workflows/deploy.yml` with these jobs:

1. **deploy-staging** - Deploy to staging on main branch push
2. **deploy-production** - Deploy to production on main branch merge
3. **deploy-preview** - Create preview deployment for PRs
4. **cleanup-preview** - Remove preview deployment when PR closes

### Database Migration Strategy
**MANUAL TASK:** Choose migration approach:

**Option A: Automatic Migrations**
- Migrations run automatically during deployment
- **Pros:** Fully automated, no manual intervention
- **Cons:** Risk of data loss, difficult rollbacks

**Option B: Manual Migration Approval**
- Migrations require manual approval before deployment
- **Pros:** Safer for production, controlled rollouts
- **Cons:** Requires manual intervention, slower deployments

**Option C: Blue-Green Deployment**
- Deploy to new environment, migrate, then switch traffic
- **Pros:** Zero downtime, easy rollbacks
- **Cons:** Complex setup, resource intensive

## Implementation Steps

### Step 1: Choose and Configure Deployment Platform
**MANUAL TASK:** Select deployment platform and create accounts:
1. **ACTION REQUIRED:** Choose deployment platform from options above
2. Create accounts and configure initial projects
3. Set up production and staging environments
4. Configure domain names and SSL certificates

### Step 2: Configure Environment Secrets
**MANUAL TASK:** Set up GitHub repository secrets:
1. Go to GitHub Settings → Secrets and variables → Actions
2. Add deployment secrets:
   ```
   PRODUCTION_DB_URL
   STAGING_DB_URL
   DEPLOYMENT_TOKEN
   DOCKER_REGISTRY_TOKEN (if using containers)
   DOMAIN_SSL_CERT (if managing SSL)
   ```

### Step 3: Create Deployment Workflows
**MANUAL TASK:** Create deployment workflow files:
1. `.github/workflows/deploy.yml` - Main deployment workflow
2. `.github/workflows/preview.yml` - Preview deployment workflow
3. Configure workflow triggers and environment conditions

### Step 4: Set up Database Migration Pipeline
**MANUAL TASK:** Configure database deployment strategy:
1. Create migration scripts for production deployment
2. Set up database backup procedures before migrations
3. Configure rollback procedures for failed migrations
4. Test migration process in staging environment

### Step 5: Configure Monitoring and Alerting
**MANUAL TASK:** Set up deployment monitoring:
1. Configure health check endpoints in application
2. Set up uptime monitoring (e.g., UptimeRobot, Pingdom)
3. Configure Slack/Discord notifications for deployment status
4. Set up error tracking (e.g., Sentry, LogRocket)

## Definition of Done
- [ ] Production environment deployed and accessible
- [ ] Staging environment deployed and functional
- [ ] Automatic deployment from main branch works
- [ ] Preview deployments work for pull requests
- [ ] Database migrations execute safely in production
- [ ] Monitoring and alerting configured and tested
- [ ] Team can deploy features without manual intervention
- [ ] Rollback procedures tested and documented

## Dependencies
- **Prerequisite:** `github-migration.md` story completed
- **Prerequisite:** `github-migration-later-actions.md` story completed
- **Prerequisite:** Production-ready application build
- **Prerequisite:** Database migration scripts ready
- **Prerequisite:** Domain name and SSL certificate decisions

## Estimated Effort
**6-8 hours** - Including platform setup, workflow configuration, and testing

## Testing Strategy
1. **Deployment Testing:**
   - Test staging deployment with sample changes
   - Test production deployment with non-breaking changes
   - Test preview deployment creation and cleanup

2. **Migration Testing:**
   - Test database migrations in staging environment
   - Verify rollback procedures work correctly
   - Test migration with realistic data volumes

3. **Monitoring Testing:**
   - Test health check endpoints
   - Verify alerting triggers correctly
   - Test notification delivery to team

## Configuration Files to Create

### 1. `.github/workflows/deploy.yml`
Main deployment workflow for staging and production

### 2. `.github/workflows/preview.yml`
Preview deployment workflow for pull requests

### 3. `docker-compose.prod.yml` (if using containers)
Production-optimized Docker Compose configuration

### 4. `scripts/deploy.sh`
Deployment script with health checks and rollback logic

### 5. Environment Configuration Files
- `.env.production.example`
- `.env.staging.example`
- `.env.preview.example`

## Security Considerations
- **Secrets Management:** Use GitHub secrets for sensitive data
- **Environment Isolation:** Ensure staging/preview don't access production data
- **Access Control:** Limit deployment permissions to authorized team members
- **SSL/TLS:** Ensure all environments use HTTPS
- **Database Security:** Use separate databases for each environment

## Cost Considerations
**MANUAL TASK:** Estimate and approve deployment costs:

**Monthly Cost Estimates:**
- **Frontend Hosting:** $0-50 (depending on platform and traffic)
- **Backend Hosting:** $20-100 (depending on platform and resources)
- **Database Hosting:** $20-100 (depending on platform and size)
- **Monitoring Services:** $0-30 (depending on features needed)
- **Domain/SSL:** $10-50 (annual cost)

**Total Estimated Monthly Cost:** $50-330

## Rollback Procedures
**MANUAL TASK:** Document rollback procedures:

1. **Application Rollback:**
   - Revert to previous deployment version
   - Update environment variables if needed
   - Verify application functionality

2. **Database Rollback:**
   - Restore from pre-migration backup
   - Run rollback migration scripts
   - Verify data integrity

3. **Emergency Procedures:**
   - Immediate traffic routing to previous version
   - Team notification procedures
   - Post-incident review process

## Notes
- **IMPORTANT:** This story requires both previous migration stories to be completed
- Start with staging environment to validate deployment process
- Test rollback procedures before deploying to production
- Consider gradual rollout strategies for major changes
- Document all deployment procedures for team knowledge sharing

## Related Stories
- **Prerequisite:** `github-migration.md` - Basic GitHub setup
- **Prerequisite:** `github-migration-later-actions.md` - CI/CD pipeline
- **Follow-up:** Advanced deployment features (canary deployments, A/B testing)
- **Follow-up:** Performance monitoring and optimization
- **Follow-up:** Backup and disaster recovery procedures

## Placeholders to Fill
Before executing this story, replace these placeholders:
- `[PLACEHOLDER: PRODUCTION_DB_URL]` - Production database connection string
- `[PLACEHOLDER: STAGING_DB_URL]` - Staging database connection string
- `[PLACEHOLDER: PRODUCTION_FRONTEND_URL]` - Production frontend domain
- `[PLACEHOLDER: PRODUCTION_BACKEND_URL]` - Production backend domain
- `[PLACEHOLDER: STAGING_FRONTEND_URL]` - Staging frontend domain
- `[PLACEHOLDER: STAGING_BACKEND_URL]` - Staging backend domain
- `[PLACEHOLDER: PRODUCTION_JWT_SECRET]` - Production JWT signing secret
- `[PLACEHOLDER: STAGING_JWT_SECRET]` - Staging JWT signing secret
- `[PLACEHOLDER: PRODUCTION_REDIS_URL]` - Production Redis connection (if used)
- `[PLACEHOLDER: STAGING_REDIS_URL]` - Staging Redis connection (if used)

## Success Metrics
- Zero-downtime deployments achieved
- Deployment time reduced to under 10 minutes
- Rollback capability tested and functional
- Team confidence in deployment process
- Reduced manual deployment effort by 90%
