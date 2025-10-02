# Deployment Instructions for Your College Voting System

## Option 1: Deploy to Render (Recommended)

Render is an excellent platform for deploying full-stack applications like yours with a generous free tier.

### Prerequisites:
1. Create a GitHub repository with your code
2. Sign up for a free Render account at https://render.com
3. Ensure your MongoDB Atlas database is accessible from anywhere (update network access in MongoDB Atlas)

### Steps to Deploy:

#### 1. Prepare Your Code
- Commit all your code to a GitHub repository
- Make sure your `.env` file is NOT committed to GitHub (it should be in `.gitignore`)

#### 2. Create Render Services

**A. Backend Web Service:**
1. Go to Render Dashboard
2. Click "New+" and select "Web Service"
3. Connect your GitHub repository
4. Configure settings:
   - Name: `ktvc-voting-backend` (or your preferred name)
   - Region: Choose the closest to your users
   - Branch: `main` (or your default branch)
   - Root Directory: Leave empty (root of repo)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`

5. Add Environment Variables (in Render dashboard):
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

6. Click "Create Web Service"

**B. Frontend Static Site:**
1. Go to Render Dashboard
2. Click "New+" and select "Static Site"
3. Connect your GitHub repository
4. Configure settings:
   - Name: `ktvc-voting-frontend` (or your preferred name)
   - Branch: `main` (or your default branch)
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Instance Type: `Free`

5. Add Environment Variables:
   ```
   CI=false
   ```

6. Click "Create Static Site"

#### 3. Configure Auto-Deployment
- Both services will automatically redeploy when you push to your GitHub repository
- You can disable this in settings if needed

#### 4. Custom Domain (Optional)
- In Render dashboard, go to your service
- Click "Settings" tab
- Scroll to "Custom Domains"
- Add your domain and follow instructions

### MongoDB Atlas Configuration
1. In MongoDB Atlas dashboard:
2. Go to "Network Access" in Security section
3. Add IP Address `0.0.0.0/0` to allow connections from anywhere
4. Or add Render's IP addresses (check Render documentation for current IPs)

## Option 2: Deploy to Railway (Alternative)

Railway is another excellent platform with a good free tier.

### Steps:
1. Create a Railway account at https://railway.app
2. Connect your GitHub repository
3. Railway will automatically detect it's a Node.js app
4. Add environment variables in the Railway dashboard
5. Deploy!

## Option 3: Deploy to Heroku (Alternative)

Note: Heroku free tier has limitations (apps sleep after 30 mins of inactivity)

### Steps:
1. Install Heroku CLI
2. Create a Heroku account
3. Login via CLI: `heroku login`
4. Create app: `heroku create your-app-name`
5. Set buildpacks:
   ```
   heroku buildpacks:set https://github.com/heroku/heroku-buildpack-nodejs
   ```
6. Deploy: `git push heroku main`
7. Set environment variables:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set JWT_SECRET=your_jwt_secret
   ```

## Environment Variables Required

Make sure to set these environment variables in your deployment platform:

```
NODE_ENV=production
PORT=10000 (or any port Render/Railway assigns)
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Post-Deployment Steps

1. **Initialize Admin User**:
   - After deployment, you'll need to create your admin user
   - Run the init script or manually create an admin user in the database

2. **Test All Functionality**:
   - Test student registration and login
   - Test admin login
   - Test voting functionality
   - Test results display

3. **Monitor Logs**:
   - Check deployment logs for any errors
   - Monitor application logs for runtime issues

## Troubleshooting Common Issues

1. **CORS Errors**:
   - Ensure your frontend URL is added to CORS configuration
   - Update CORS settings in your server.js if needed

2. **Database Connection Issues**:
   - Verify MongoDB Atlas network access settings
   - Check connection string format

3. **Build Failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are correctly listed in package.json

4. **Environment Variables**:
   - Double-check all required environment variables are set
   - Ensure no typos in variable names

## Estimated Costs

With the free tiers:
- Render: $0/month (with some limitations on usage)
- Railway: $0/month (with some limitations on usage)
- Heroku: $0/month (with sleep cycles for free tier)

For production usage, expect:
- Render: ~$7-15/month for basic plan
- Railway: ~$5-10/month for basic plan
- Heroku: ~$7/month for hobby plan

## Recommendations

1. **Start with Render** - It has the best free tier and easiest setup
2. **Use MongoDB Atlas** - Keep your database separate for reliability
3. **Set up monitoring** - Use Render's built-in monitoring or add third-party tools
4. **Backup your database** - Regular backups are essential for voting systems

Your application should work well on any of these platforms. Render is recommended for its simplicity and generous free tier.