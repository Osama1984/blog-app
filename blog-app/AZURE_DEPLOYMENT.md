# Azure Deployment Configuration

## Required Environment Variables in Azure Web App

Set these in your Azure Web App's Configuration > Application Settings:

```bash
# Database
DATABASE_URL=your-production-database-url

# NextAuth.js
NEXTAUTH_URL=https://your-app-name.azurewebsites.net
NEXTAUTH_SECRET=your-production-nextauth-secret

# OAuth Providers (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Additional Azure settings
WEBSITE_NODE_DEFAULT_VERSION=22-lts
SCM_DO_BUILD_DURING_DEPLOYMENT=false
```

## Azure Web App Configuration

1. **Runtime Stack**: Node.js 22 LTS
2. **Startup Command**: `npm start`
3. **Build Command**: Already handled in GitHub Actions
4. **Node Version**: 22.x (set via WEBSITE_NODE_DEFAULT_VERSION)

## Database Setup

Make sure your production database is accessible from Azure and that you've run the migrations:

```bash
# Run these commands manually in Azure Console or set up in CI/CD
npx prisma migrate deploy
npx prisma generate
npm run db:seed  # Only for initial setup
```

## GitHub Actions Secrets Required

Make sure these secrets are set in your GitHub repository:

- `AZUREAPPSERVICE_CLIENTID_839D9FE48B5B488198644073AF79F2E2`
- `AZUREAPPSERVICE_TENANTID_035F2AD8ED4E4884B2CF5031BF77D9AF`
- `AZUREAPPSERVICE_SUBSCRIPTIONID_8414432C11D84553AD3ADD68EC587958`

These are automatically generated when you set up deployment from Azure Portal.
