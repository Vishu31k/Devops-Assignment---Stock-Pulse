// ==============================================================================
// Stock Pulse — Jenkins CI/CD Pipeline (Declarative)
// ==============================================================================
//
// This Jenkinsfile automates the entire software delivery workflow:
//
//   CI Phase:  Checkout → Install → Test → Build → Docker Build
//   CD Phase:  Docker Hub Login → Docker Push → Deploy
//
// The pipeline is written in Declarative Pipeline syntax, which is the
// recommended approach for Jenkins. Each "stage" represents one step in
// the workflow, and Jenkins will stop the pipeline if any stage fails.
//
// Prerequisites:
//   1. Jenkins installed with Pipeline, Git, and Docker plugins
//   2. Docker and Docker Compose installed on the Jenkins agent
//   3. Node.js installed on the Jenkins agent (or use a Docker agent)
//   4. Jenkins credential 'docker-hub-credentials' (Username with password)
//   5. GitHub repository URL configured in the Jenkins job
//
// ==============================================================================

pipeline {
    // Run on any available Jenkins agent
    agent any

    // -------------------------------------------------------------------------
    // Environment Variables
    // -------------------------------------------------------------------------
    // These variables are available to all stages in the pipeline.
    // IMPORTANT: Never put passwords or secrets directly in the Jenkinsfile.
    // Use Jenkins credentials instead (configured in Jenkins UI).
    environment {
        // Docker Hub username — change this to YOUR Docker Hub username
        DOCKER_HUB_USER = 'stockpulsedev'

        // Docker image names (will be pushed to Docker Hub)
        BACKEND_IMAGE  = "${DOCKER_HUB_USER}/stockpulse-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB_USER}/stockpulse-frontend"

        // Use the Jenkins BUILD_NUMBER as the image tag for versioning
        // This means each build creates a uniquely tagged image
        IMAGE_TAG = "${BUILD_NUMBER}"

        // Docker Hub credentials ID — this must match the credential
        // you create in Jenkins → Manage Jenkins → Credentials
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    // -------------------------------------------------------------------------
    // Pipeline Stages
    // -------------------------------------------------------------------------
    stages {

        // =====================================================================
        // CONTINUOUS INTEGRATION (CI) PHASE
        // =====================================================================

        // Stage 1: Checkout source code from GitHub
        // -----------------------------------------------------------------
        // This pulls the latest code from the GitHub repository.
        // "checkout scm" automatically uses the repository URL configured
        // in the Jenkins job settings.
        stage('Checkout') {
            steps {
                echo '=========================================='
                echo 'Stage 1: Checking out source code from GitHub'
                echo '=========================================='
                checkout scm
            }
        }

        // Stage 2: Install backend dependencies
        // -----------------------------------------------------------------
        // Runs "npm install" in the backend folder to download all
        // Node.js packages listed in backend/package.json.
        // --no-audit: skips vulnerability audit (faster in CI)
        // --no-fund: skips funding messages (cleaner output)
        stage('Install Backend Dependencies') {
            steps {
                echo '=========================================='
                echo 'Stage 2: Installing backend dependencies'
                echo '=========================================='
                dir('backend') {
                    bat 'npm install --no-audit --no-fund'
                }
            }
        }

        // Stage 3: Install frontend dependencies
        // -----------------------------------------------------------------
        // Same as above but for the frontend React application.
        stage('Install Frontend Dependencies') {
            steps {
                echo '=========================================='
                echo 'Stage 3: Installing frontend dependencies'
                echo '=========================================='
                dir('frontend') {
                    bat 'npm install --no-audit --no-fund'
                }
            }
        }

        // Stage 4: Run backend tests
        // -----------------------------------------------------------------
        // Executes the automated test suite for the backend API.
        // If any test fails, the pipeline stops here — no broken code
        // will be packaged or deployed. This is called a "quality gate."
        stage('Backend Tests') {
            steps {
                echo '=========================================='
                echo 'Stage 4: Running backend automated tests'
                echo '=========================================='
                dir('backend') {
                    bat 'npm test'
                }
            }
        }

        // Stage 5: Run frontend tests
        // -----------------------------------------------------------------
        // Executes the automated test suite for the React frontend.
        // Uses Vitest (a fast test runner designed for Vite projects).
        stage('Frontend Tests') {
            steps {
                echo '=========================================='
                echo 'Stage 5: Running frontend automated tests'
                echo '=========================================='
                dir('frontend') {
                    bat 'npm test'
                }
            }
        }

        // Stage 6: Build frontend for production
        // -----------------------------------------------------------------
        // Runs "npm run build" which invokes Vite to compile and optimize
        // the React application into static files (HTML, CSS, JS).
        // These files will be served by nginx in the Docker container.
        stage('Frontend Build') {
            steps {
                echo '=========================================='
                echo 'Stage 6: Building frontend for production'
                echo '=========================================='
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        // Stage 7: Build Docker images
        // -----------------------------------------------------------------
        // Creates Docker images for the backend and frontend.
        // Each image gets TWO tags:
        //   1. Build number tag (e.g., stockpulsedev/stockpulse-backend:5)
        //      → Useful for tracking exactly which build produced the image
        //   2. "latest" tag (e.g., stockpulsedev/stockpulse-backend:latest)
        //      → Always points to the most recent successful build
        stage('Docker Build') {
            steps {
                echo '=========================================='
                echo 'Stage 7: Building Docker images'
                echo '=========================================='
                // Build backend image with build number tag
                bat "docker build -t %BACKEND_IMAGE%:%IMAGE_TAG% ./backend"
                // Also tag it as "latest"
                bat "docker tag %BACKEND_IMAGE%:%IMAGE_TAG% %BACKEND_IMAGE%:latest"

                // Build frontend image with build number tag
                bat "docker build -t %FRONTEND_IMAGE%:%IMAGE_TAG% ./frontend"
                // Also tag it as "latest"
                bat "docker tag %FRONTEND_IMAGE%:%IMAGE_TAG% %FRONTEND_IMAGE%:latest"

                echo 'Docker images built successfully!'
            }
        }

        // =====================================================================
        // CONTINUOUS DEPLOYMENT (CD) PHASE
        // =====================================================================

        // Stage 8: Login to Docker Hub
        // -----------------------------------------------------------------
        // Authenticates Jenkins with Docker Hub so it can push images.
        // The password is stored securely in Jenkins Credentials —
        // it is NEVER written in this Jenkinsfile.
        //
        // withCredentials: Jenkins injects the username and password from
        // the credential store into environment variables for this block.
        stage('Docker Hub Login') {
            steps {
                echo '=========================================='
                echo 'Stage 8: Logging into Docker Hub'
                echo '=========================================='
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_CREDENTIALS_ID}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                }
            }
        }

        // Stage 9: Push Docker images to Docker Hub
        // -----------------------------------------------------------------
        // Uploads the built images to Docker Hub so they can be pulled
        // and deployed on any server. Both the versioned tag and the
        // "latest" tag are pushed.
        stage('Docker Push') {
            steps {
                echo '=========================================='
                echo 'Stage 9: Pushing images to Docker Hub'
                echo '=========================================='
                // Push backend images (both tags)
                bat "docker push %BACKEND_IMAGE%:%IMAGE_TAG%"
                bat "docker push %BACKEND_IMAGE%:latest"

                // Push frontend images (both tags)
                bat "docker push %FRONTEND_IMAGE%:%IMAGE_TAG%"
                bat "docker push %FRONTEND_IMAGE%:latest"

                echo 'Images pushed to Docker Hub successfully!'
            }
        }

        // Stage 10: Deploy the application
        // -----------------------------------------------------------------
        // Uses Docker Compose to deploy the complete application stack.
        // Steps:
        //   1. "docker compose down" — stops and removes existing containers
        //   2. "docker compose up -d --build" — rebuilds and starts all
        //      services in detached mode (runs in background)
        //
        // After this stage, the application should be accessible at:
        //   Frontend: http://localhost:3000
        //   Backend:  http://localhost:5000
        stage('Deploy') {
            steps {
                echo '=========================================='
                echo 'Stage 10: Deploying with Docker Compose'
                echo '=========================================='
                // Stop existing containers (if any)
                bat 'docker compose down'

                // Rebuild and start all services in detached mode
                bat 'docker compose up -d --build'

                // Verify containers are running
                bat 'docker ps'

                echo 'Deployment complete!'
                echo 'Frontend: http://localhost:3000'
                echo 'Backend:  http://localhost:5000'
            }
        }
    }

    // -------------------------------------------------------------------------
    // Post-Build Actions
    // -------------------------------------------------------------------------
    // These actions run AFTER all stages, regardless of success or failure.
    // This is useful for notifications, cleanup, and logging.
    post {
        // Runs only if the entire pipeline succeeds
        success {
            echo '============================================'
            echo 'PIPELINE COMPLETED SUCCESSFULLY!'
            echo '============================================'
            echo "Build #${BUILD_NUMBER} deployed successfully."
            echo "Frontend: http://localhost:3000"
            echo "Backend:  http://localhost:5000"
            echo "Docker images pushed to Docker Hub:"
            echo "  ${BACKEND_IMAGE}:${IMAGE_TAG}"
            echo "  ${FRONTEND_IMAGE}:${IMAGE_TAG}"
            echo '============================================'
        }

        // Runs only if the pipeline fails at any stage
        failure {
            echo '============================================'
            echo 'PIPELINE FAILED!'
            echo '============================================'
            echo "Build #${BUILD_NUMBER} failed."
            echo 'Check the console output above to identify'
            echo 'which stage failed and why.'
            echo '============================================'
        }

        // Runs after every build (success or failure)
        always {
            echo "Pipeline finished. Build number: ${BUILD_NUMBER}"
        }
    }
}
