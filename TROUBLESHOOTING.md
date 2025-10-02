# Troubleshooting Guide

## Common Issues and Solutions

### 1. Font Awesome Icons Not Displaying

**Problem**: Icons are not showing on the Home page or other components.

**Solution**: 
- Ensure the Font Awesome script is included in `client/public/index.html`:
  ```html
  <script src="https://kit.fontawesome.com/e08e1f5afa.js" crossorigin="anonymous"></script>
  ```
- Check browser console for any CORS or loading errors
- Verify the kit ID in the script URL is correct

### 2. "Failed to fetch contestants data" Error

**Problem**: Student dashboard shows error message about failing to load data.

**Common Causes and Solutions**:

#### A. Backend Not Running
- Ensure the backend server is running
- Check Render logs for any deployment errors
- Verify the backend URL is accessible

#### B. CORS Issues
- Check browser console for CORS errors
- Ensure CORS is enabled in server.js:
  ```javascript
  app.use(cors());
  ```

#### C. Authentication Issues
- Verify the user is properly logged in
- Check that the JWT token is being sent with requests
- Look for 401 Unauthorized errors in browser network tab

#### D. Network Connectivity
- Check that the frontend can reach the backend API
- Verify environment variables are set correctly in Render
- Check MongoDB connection in backend logs

### 3. Deployment Issues

#### A. "Service Root Directory" Errors
- In Render, check that the Root Directory setting matches your repository structure
- If code is in repository root, set Root Directory to `.` (single dot)
- If code is in a subdirectory, specify the correct path

#### B. Build Failures
- Check build logs in Render for dependency installation errors
- Ensure all required dependencies are in package.json
- Verify Node.js version compatibility

#### C. Runtime Errors
- Check application logs in Render
- Verify all environment variables are set
- Ensure MongoDB Atlas allows connections from Render IPs

### 4. Debugging Steps

#### A. Check Browser Console
1. Open browser developer tools (F12)
2. Look for error messages in the Console tab
3. Check the Network tab for failed API requests
4. Look for CORS errors or 404/500 status codes

#### B. Check Network Requests
1. In Network tab, look for requests to `/api/` endpoints
2. Check request headers for authentication tokens
3. Examine response status codes and error messages
4. Verify requests are going to the correct URL

#### C. Verify Environment Variables
1. In Render dashboard, check that all required environment variables are set:
   - `NODE_ENV=production`
   - `MONGODB_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_secret_key`
   - `PORT=10000`

#### D. Test API Endpoints Directly
1. Use a tool like Postman or curl to test backend API endpoints
2. Test authentication endpoints first
3. Verify you can get a valid JWT token
4. Test other endpoints with the token

### 5. Common Fix Checklist

- [ ] Font Awesome script added to index.html
- [ ] Backend server is running and accessible
- [ ] MongoDB connection string is correct
- [ ] All environment variables are set in Render
- [ ] CORS is enabled in backend
- [ ] JWT tokens are being sent with requests
- [ ] Frontend and backend are using the same domain/URL structure
- [ ] No firewall or network restrictions blocking API requests

### 6. Additional Debugging Information

If issues persist:

1. **Enable Detailed Logging**:
   Add this to your server.js for more detailed error logging:
   ```javascript
   app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).send('Something broke!');
   });
   ```

2. **Check MongoDB Atlas**:
   - Ensure the cluster is running
   - Verify network access rules allow connections
   - Check that the database and collections exist

3. **Verify API Endpoints**:
   Test these endpoints directly:
   - `GET /api/student/voting/session`
   - `GET /api/student/voting/positions`
   - `GET /api/student/contestants`

4. **Check Token Expiration**:
   - JWT tokens may expire, requiring re-login
   - Check token expiration settings in authUtils.js

By following these troubleshooting steps, most deployment and runtime issues should be resolved.