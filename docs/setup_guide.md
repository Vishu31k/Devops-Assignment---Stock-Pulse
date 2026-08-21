# Complete Setup Guide: Git, Jenkins, and Docker

This guide provides step-by-step instructions to set up Version Control (Git), CI/CD (Jenkins), and Containerization (Docker) for your project on a Windows machine.

---

## Part 1: Git Setup

Git tracks changes in your code and GitHub stores it online. Open PowerShell or Command Prompt in your project folder to run these commands.

**1. Initialize git in the project folder**
Command: `git init`
- **What it does:** Creates a hidden `.git` folder in your directory.
- **Why it's needed:** This turns your normal folder into a Git repository capable of tracking changes.
- **Expected output:** `Initialized empty Git repository in C:/.../.git/`

**2. Create .gitignore (already done in project)**
- This file tells Git which files (like `node_modules` or `.env`) to ignore so they aren't uploaded to GitHub.

**3. Stage all files**
Command: `git add .`
- **What it does:** Adds all modified and new files to the "staging area".
- **Why it's needed:** You must stage files before you can commit them.
- **Expected output:** (No output if successful)

**4. Create initial commit**
Command: `git commit -m "Initial project commit"`
- **What it does:** Saves a snapshot of your staged files with a descriptive message.
- **Why it's needed:** Creates a permanent record of the code at this exact point in time.
- **Expected output:** A list of files changed and insertions/deletions.

**5. Create GitHub repository**
- Go to github.com and log in.
- Click the "+" icon in the top right and select "New repository".
- Name it `stock-pulse-devops`, leave it Public, and do NOT check "Add a README". Click "Create repository".

**6. Add remote origin**
Command: `git remote add origin https://github.com/YOUR_USERNAME/stock-pulse-devops.git`
- **What it does:** Links your local repository to the URL of your new GitHub repository.
- **Why it's needed:** Git needs to know where to send your code.
- **Expected output:** (No output if successful)

**7. Push to GitHub**
Command: `git push -u origin master` (or `main`)
- **What it does:** Uploads your local commits to the GitHub repository.
- **Why it's needed:** To back up your code and trigger CI/CD pipelines.
- **Expected output:** Progress percentages, ending with `Branch master set up to track remote branch master`.

**8. Recommended commit messages**
When making future changes, use clear messages:
- `git commit -m "Add login page UI"`
- `git commit -m "Fix database connection bug"`
- `git commit -m "Update Dockerfile for frontend"`

---

## Part 2: Jenkins Setup

Jenkins automates your build and deployment process.

**1. Download and install Jenkins on Windows**
- Go to jenkins.io/download and download the Windows installer.
- Run the installer. When asked, choose "Run service as LocalSystem".
- It will install and start Jenkins on port `8080`.

**2. Initial admin password**
- Open your browser and go to `http://localhost:8080`.
- It will ask for an Administrator password.
- Open Notepad and paste this path to open the file: `C:\Program Files\Jenkins\secrets\initialAdminPassword`
- Copy the password and paste it into the browser.

**3. Install recommended plugins**
- Click "Install suggested plugins". This will take a few minutes to download standard tools.
- Create an Admin User when prompted and click Save.

**4. Install additional plugins**
- On the Jenkins dashboard, click **Manage Jenkins** > **Plugins**.
- Go to the **Available plugins** tab.
- Search for and check these boxes:
  - Docker Pipeline
  - Docker plugin
- Click **Install without restart**.

**5. Create Docker Hub credentials**
Jenkins needs to log into Docker Hub to push your images.
- In Jenkins, go to **Manage Jenkins** > **Credentials** > **System** > **Global credentials**.
- Click **Add Credentials**.
- Kind: Username with password
- Username: *Your Docker Hub username*
- Password: *Your Docker Hub password*
- ID: `docker-hub-credentials` (This EXACT text is used in your Jenkinsfile)
- Description: Docker Hub account
- Click **Create**.

**6. Create a new Pipeline job**
- Click **New Item** on the dashboard.
- Name it `StockPulse-Pipeline`.
- Select **Pipeline** and click **OK**.

**7. Configure Git repository URL**
- Scroll down to the **Pipeline** section.
- Definition: Select **Pipeline script from SCM**.
- SCM: Select **Git**.
- Repository URL: Enter your GitHub repository URL (e.g., `https://github.com/YOUR_USERNAME/stock-pulse-devops.git`).
- Branch Specifier: `*/master` or `*/main` depending on your git setup.

**8. Set Jenkinsfile path**
- In the Script Path field, ensure it says `Jenkinsfile`.
- Click **Save**.

**9. Run the pipeline**
- On your job page, click **Build Now**.
- You will see a new build appear under "Build History". Click on it to view progress.

**10. Troubleshooting common issues**
- **Docker command not found:** Ensure Jenkins has permission to run Docker. Restart the Jenkins service after installing Docker.
- **Git not found:** Ensure Git is installed on your Windows machine and added to your System PATH.

---

## Part 3: Docker Setup

Docker packages your app so it runs identically everywhere.

**1. Install Docker Desktop on Windows**
- Go to docker.com/products/docker-desktop and download the Windows installer.
- Run the installer. Ensure WSL 2 (Windows Subsystem for Linux) is checked.
- Restart your computer if prompted.

**2. Verify installation**
- Open PowerShell and type: `docker --version`
- You should see output like: `Docker version 24.x.x, build...`

**3. Understanding the Dockerfiles**
A `Dockerfile` is a recipe for building an image. You have one in the frontend and one in the backend.
- `FROM node:18`: Gets the base operating system with Node.js.
- `WORKDIR /app`: Creates a folder inside the container.
- `COPY package.json .`: Copies dependency lists.
- `RUN npm install`: Installs dependencies.
- `COPY . .`: Copies the rest of your code.
- `CMD ["npm", "start"]`: The command to start the app.

**4. Building manually with docker compose**
While Jenkins does this automatically, you can do it locally for testing.
- Open PowerShell in your root project folder (where `docker-compose.yml` is).
- Command: `docker compose up --build -d`
- **What it does:** Builds the images and starts the containers in detached mode (background).

**5. Checking running containers**
Command: `docker ps`
- **What it does:** Lists all currently running containers, showing their IDs, names, and the ports they are using.

**6. Viewing logs**
Command: `docker logs <container-name>` (e.g., `docker logs stock-pulse-backend`)
- **What it does:** Shows the console output of that specific container. Useful for debugging errors.

**7. Stopping containers**
Command: `docker compose down`
- **What it does:** Stops and removes all containers, networks, and images created by `docker compose up`.
