# Stock Pulse DevOps Project - Screenshot Checklist

Here is a comprehensive checklist of all the screenshots needed for your project report and final demo. 

| # | What to Capture | How to Capture | Where in Report | What It Proves |
|---|----------------|----------------|-----------------|----------------|
| 1 | Stock Pulse Login Page | Navigate to `http://localhost` (or deployed URL) in your browser. Ensure the login form is clearly visible. | Introduction / User Interface | The frontend application is accessible and running. |
| 2 | Stock Pulse Registration Page | Click on the "Register" link from the login page. Capture the empty form. | User Interface | User management features are implemented. |
| 3 | Dashboard with stock cards | Log in to the application. Capture the main dashboard showing market indices or popular stock cards. | Core Features | Successful login and basic data retrieval from backend. |
| 4 | Stock Search results | Type a ticker (e.g., AAPL) in the search bar and press enter. Capture the dropdown or search results page. | Core Features | Search functionality and external API integration are working. |
| 5 | Stock Details page with chart | Click on a specific stock to view its detailed page. Ensure the price chart and key statistics are visible. | Core Features | Dynamic data visualization and detailed API data parsing. |
| 6 | Portfolio page with stocks | Add stocks to the portfolio and navigate to the Portfolio section. Capture the list of owned stocks. | Core Features | Database integration for user-specific data is functioning. |
| 7 | Portfolio P&L summary | Ensure the portfolio shows the Total Value, Invested Amount, and Profit/Loss summary clearly. | Core Features | Business logic and calculations in the backend are correct. |
| 8 | Watchlist page | Add stocks to the watchlist and navigate to the Watchlist section. Capture the list. | Core Features | Secondary user-specific data tracking. |
| 9 | GitHub repository main page | Go to your project repo on github.com. Capture the main page showing files and the README. | Version Control / Setup | The code is properly version-controlled and hosted. |
| 10 | GitHub commit history | Click on the "commits" link on GitHub. Capture the list showing consistent, descriptive commit messages. | Version Control | Proper use of Git for iterative development. |
| 11 | GitHub folder structure | Expand directories or show the tree view in GitHub to highlight the frontend, backend, and infrastructure folders. | Architecture | Code is organized properly into a multi-tier structure. |
| 12 | Jenkins Dashboard | Navigate to `http://localhost:8080`. Capture the main dashboard showing your job list. | CI/CD | Jenkins is installed and operational. |
| 13 | Jenkins Pipeline configuration | Inside your Jenkins job, click "Configure". Capture the section showing the GitHub repo URL and Jenkinsfile path. | CI/CD Configuration | The pipeline is correctly linked to the source code. |
| 14 | Jenkins Pipeline stage view | Navigate to the job's main page after a build. Capture the Stage View graph showing all stages (Build, Test, Deploy) as green. | CI/CD Execution | The pipeline runs successfully from start to finish. |
| 15 | Jenkins Console Output | Click on the latest successful build, then "Console Output". Scroll to the bottom and capture the "SUCCESS" message. | CI/CD Verification | Detailed proof that the build steps executed without errors. |
| 16 | Docker images list | Open PowerShell and run `docker images`. Capture the output showing frontend, backend, and database images. | Containerization | Docker images were successfully built and tagged. |
| 17 | Running containers | Open PowerShell and run `docker ps`. Capture the output showing the status "Up" and port mappings. | Containerization | The application components are running properly in isolated containers. |
| 18 | Docker Hub repositories | Log in to hub.docker.com. Capture your repository page showing the pushed images with tags. | Image Registry | Images are being pushed to a remote registry successfully. |
| 19 | Backend tests passing | Run `npm test` or `pytest` in the backend folder. Capture the terminal output showing tests passed. | Testing | Backend business logic is verified. |
| 20 | Frontend tests passing | Run `npm test` in the frontend folder. Capture the terminal output showing UI/component tests passed. | Testing | Frontend components render and behave as expected. |
| 21 | Frontend Vite build output | Run `npm run build` in the frontend folder. Capture the console showing the optimized production build chunks. | Build Process | Frontend assets compile successfully for production. |
| 22 | MongoDB data (optional) | Use MongoDB Compass or mongosh to connect to the database. Capture a collection (e.g., users) showing data. | Database | Database connectivity and schema structure are working. |
