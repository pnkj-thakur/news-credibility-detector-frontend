# Project Setup Guide

Complete guide to set up and run the News Credibility Detector Frontend application.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Building for Production](#building-for-production)
6. [Project Structure](#project-structure)
7. [Available Commands](#available-commands)
8. [Troubleshooting](#troubleshooting)

## System Requirements

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (or yarn v1.22.0+)
- **Git**: For version control
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Check Your Versions

```bash
node --version
npm --version
git --version
```

## Installation

### Step 1: Clone or Download the Project

If using Git:
```bash
git clone <repository-url>
cd news-credibility-detector-frontend
```

Or navigate to the project directory if already downloaded.

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

This will install all required packages including:
- React 18.2.0
- React Router 6.8.0
- Axios 1.3.0
- React Icons 4.7.1

The installation may take a few minutes depending on your internet connection.

### Step 3: Verify Installation

```bash
npm list
```

This will display all installed packages and their versions.

## Configuration

### Environment Variables

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   REACT_APP_API_TIMEOUT=30000
   REACT_APP_APP_NAME=News Credibility Detector
   REACT_APP_ENVIRONMENT=development
   ```

### Notes on Environment Variables
- Variables must start with `REACT_APP_` to be accessible in the frontend
- Changes to `.env` require restarting the development server
- Never commit `.env` to version control (it's in `.gitignore`)

## Running the Application

### Development Mode

Start the development server:
```bash
npm start
```

The application will automatically open in your default browser at:
```
http://localhost:3000
```

The page will reload automatically when you make changes to the code. You'll also see any linting errors in the console.

### Test Mode

Run the test suite:
```bash
npm test
```

This launches the test runner in interactive watch mode. Press `q` to quit.

## Building for Production

### Create an Optimized Build

```bash
npm run build
```

This will:
- Create a `build` folder with optimized production files
- Minimize and bundle JavaScript
- Optimize CSS
- Create source maps for debugging

The build is minified and the filenames include hashes for caching purposes.

### Deploy the Build

The contents of the `build` folder can be deployed to any static hosting service:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **AWS S3 + CloudFront**
- **Traditional web hosting**

Example deployment to GitHub Pages:
```bash
npm install --save-dev gh-pages
# Add to package.json: "homepage": "https://yourusername.github.io/repo-name"
npm run build
npm run deploy
```

## Project Structure

```
news-credibility-detector-frontend/
│
├── public/
│   └── index.html                 # Main HTML file
│
├── src/
│   ├── components/                # Reusable components
│   │   ├── Header.js
│   │   ├── Header.css
│   │   ├── Sidebar.js
│   │   └── Sidebar.css
│   │
│   ├── context/                   # Context API for state management
│   │   └── AuthContext.js         # Authentication context
│   │
│   ├── pages/                     # Page components
│   │   ├── Login.js
│   │   ├── Login.css
│   │   ├── Dashboard.js
│   │   ├── Dashboard.css
│   │   ├── ArticleAnalysis.js
│   │   ├── ArticleAnalysis.css
│   │   ├── ArticlesList.js
│   │   ├── ArticlesList.css
│   │   ├── Organizations.js
│   │   ├── Organizations.css
│   │   ├── DetailedReport.js
│   │   ├── DetailedReport.css
│   │   ├── Help.js
│   │   └── Help.css
│   │
│   ├── App.js                    # Main app component with routing
│   ├── App.css                   # App styles
│   ├── index.js                  # React entry point
│   └── index.css                 # Global styles
│
├── .env                          # Environment variables (create manually)
├── .env.example                  # Example environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies and scripts
├── README.md                     # Project documentation
├── SETUP.md                      # This file
└── node_modules/                # Installed packages (auto-generated)
```

## Available Commands

### Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 3000 |
| `npm test` | Run tests in watch mode |
| `npm run build` | Build for production |
| `npm run eject` | Eject from Create React App (irreversible) |

### Git Commands

```bash
# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to remote
git push origin main
```

## Troubleshooting

### Issue: Port 3000 is already in use

**Solution 1**: Kill the process using port 3000
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :3000
kill -9 <PID>
```

**Solution 2**: Use a different port
```bash
PORT=3001 npm start
```

### Issue: npm install fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Changes not reflecting in browser

**Solution**:
1. Hard refresh the browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Restart the development server: Stop with `Ctrl+C` and run `npm start` again

### Issue: Module not found errors

**Solution**:
```bash
# Reinstall dependencies
npm install

# If issues persist, try:
npm install --legacy-peer-deps
```

### Issue: CSS not applying correctly

**Solution**:
1. Check that CSS file is imported in the component
2. Verify the CSS file path is correct
3. Hard refresh the browser
4. Check browser DevTools for CSS errors

### Issue: Authentication not persisting

**Solution**:
1. Check browser local storage is accessible
2. Clear browser cookies and cache
3. Ensure localStorage is not disabled
4. Check browser console for errors

### Issue: Build fails or has warnings

**Solution**:
```bash
# Clean and rebuild
rm -rf build
npm run build
```

### Issue: API calls returning 404 or connection errors

**Solution**:
1. Verify backend server is running
2. Check API_BASE_URL in .env matches backend URL
3. Verify CORS is configured on backend
4. Check network tab in browser DevTools

## Development Workflow

### Creating a New Component

1. Create a folder in `src/components` or `src/pages`
2. Create `ComponentName.js` and `ComponentName.css`
3. Import and export the component
4. Use in App.js or other components

### Adding a New Route

1. Create a new page component in `src/pages`
2. Import the component in `App.js`
3. Add a `<Route>` element in the Router configuration

### Styling Best Practices

- Use CSS classes for styling
- Follow BEM naming convention where applicable
- Mobile-first responsive design
- Use CSS Grid and Flexbox for layouts
- Maintain consistent spacing and colors

## Performance Tips

- Use lazy loading for routes
- Optimize images and assets
- Minimize bundle size
- Use React DevTools to identify performance issues
- Implement code splitting with React.lazy()

## Security Considerations

- Never commit sensitive data (.env files)
- Always use HTTPS in production
- Sanitize user inputs before displaying
- Implement CORS properly
- Use secure authentication tokens (JWT)
- Keep dependencies updated

## Next Steps

1. Start the development server: `npm start`
2. Log in with test credentials
3. Explore the different pages and features
4. Review the code structure and components
5. Connect to your backend API
6. Deploy to production when ready

## Additional Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [MDN Web Docs](https://developer.mozilla.org)
- [CSS-Tricks](https://css-tricks.com)

## Support and Contributions

For issues or questions:
1. Check the README.md file
2. Review browser console for errors
3. Check the Help page in the application
4. Contact the development team

---

**Last Updated**: February 26, 2026
**Project Version**: 1.0.0
