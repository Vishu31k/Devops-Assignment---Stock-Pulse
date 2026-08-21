# Viva Q&A - Stock Pulse DevOps Project

Here are 40+ potential viva or interview questions and answers tailored to your project. Memorize these concepts to explain your work confidently.

## DevOps Concepts

**1. What is DevOps?**
DevOps is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the systems development life cycle and provide continuous delivery with high software quality. It fosters a culture of collaboration between traditionally siloed teams.

**2. What is CI/CD?**
CI/CD stands for Continuous Integration and Continuous Deployment/Delivery. Continuous Integration automatically builds and tests code changes merged into a shared repository. Continuous Deployment automates the release of these validated changes to production environments.

**3. Difference between CI and CD?**
Continuous Integration focuses on merging code frequently and running automated tests to detect bugs early. Continuous Delivery ensures the code is always in a deployable state, requiring manual approval to go live. Continuous Deployment automates the entire process, pushing code to production without human intervention.

**4. What is a pipeline?**
A pipeline is a set of automated processes that allow developers to compile, build, test, and deploy code. It acts as a conveyer belt for software delivery. In our project, Jenkins manages the pipeline steps defined in a Jenkinsfile.

**5. What are the benefits of DevOps?**
DevOps increases deployment speed, enabling faster time-to-market for new features. It improves system reliability through automated testing and monitoring. It also enhances team collaboration and reduces the time spent fixing bugs by catching them early.

**6. What is Infrastructure as Code?**
Infrastructure as Code (IaC) is the practice of managing and provisioning computing infrastructure through machine-readable definition files, rather than physical hardware configuration. In this project, tools like Docker Compose act as IaC by defining the environment in code.

**7. What is continuous monitoring?**
Continuous monitoring is the practice of tracking the performance, health, and security of applications and infrastructure in real-time. It helps teams identify and resolve issues before they impact end users. It completes the feedback loop in the DevOps lifecycle.

**8. What is the DevOps lifecycle?**
The DevOps lifecycle consists of continuous phases: Plan, Code, Build, Test, Release, Deploy, Operate, and Monitor. It is an infinite loop representing the continuous nature of software development and improvement. Each phase relies on automation and collaboration.

**9. What is a build artifact?**
A build artifact is the compiled and packaged output of the build process, such as a JAR file, an executable, or a Docker image. It is the tangible asset that gets tested and eventually deployed to servers. In this project, our primary artifacts are Docker images.

**10. What is blue-green deployment?**
Blue-green deployment is a technique that reduces downtime and risk by running two identical production environments (Blue and Green). Traffic is routed to one environment while the other is updated. Once the update is verified, traffic is switched over to the updated environment.

## Jenkins

**11. What is Jenkins?**
Jenkins is an open-source automation server used to build, test, and deploy software. It facilitates continuous integration and continuous delivery by orchestrating pipelines. It has a massive ecosystem of plugins to integrate with almost any tool.

**12. What is a Jenkinsfile?**
A Jenkinsfile is a text file that contains the definition of a Jenkins Pipeline and is checked into source control. It allows the pipeline to be versioned alongside the code. It defines the stages like Build, Test, and Deploy.

**13. Declarative vs Scripted pipeline?**
Declarative pipelines provide a stricter, more structured syntax that is easier to read and write for most users. Scripted pipelines use a Groovy-based syntax that offers more complex programmatic control but is harder to maintain. We use a declarative pipeline for better readability.

**14. What are Jenkins stages?**
Stages are major subdivisions of a Jenkins pipeline, representing distinct phases like "Build", "Test", and "Deploy". Each stage contains one or more steps, which are the actual commands executed. Visualizing stages helps identify where a pipeline failed.

**15. What are Jenkins credentials?**
Jenkins credentials are a secure way to store sensitive information like passwords, SSH keys, and API tokens. Instead of hardcoding secrets in scripts, Jenkins injects them securely during runtime. We use this for Docker Hub credentials.

**16. How does Jenkins connect to GitHub?**
Jenkins connects to GitHub using the Git plugin and a configured Git repository URL. We set up a Jenkins job that pulls code from the repository using either HTTPS or SSH. Authentication is handled via credentials stored in Jenkins.

**17. What is a webhook?**
A webhook is an automated HTTP callback triggered by specific events. In a CI/CD context, GitHub sends a webhook to Jenkins whenever a new commit is pushed. This automatically triggers a new pipeline build without manual intervention.

**18. What are post actions in Jenkins?**
Post actions in a Jenkins declarative pipeline run after the pipeline or a specific stage completes. They are used for tasks like sending email notifications, archiving artifacts, or cleaning up workspaces. They can be conditioned based on the build status (success, failure, always).

## Docker

**19. What is Docker?**
Docker is an open-source platform that uses OS-level virtualization to deliver software in packages called containers. Containers isolate applications from their environment, ensuring they run consistently everywhere. It solves the "it works on my machine" problem.

**20. Dockerfile vs Docker image vs container?**
A Dockerfile is a text document containing instructions to build an image. A Docker image is a read-only template built from the Dockerfile containing the application and its dependencies. A container is a runnable, lightweight instance of a Docker image.

**21. What is Docker Compose?**
Docker Compose is a tool for defining and running multi-container Docker applications. It uses a YAML file to configure the application's services, networks, and volumes. With a single command (`docker compose up`), it starts the entire stack.

**22. What is a multi-stage build?**
A multi-stage build in a Dockerfile uses multiple `FROM` statements to create intermediate images. It allows you to compile code in one stage and copy only the necessary built artifacts into the final, smaller production image. This drastically reduces image size and improves security.

**23. What is a Docker volume?**
A Docker volume is a mechanism for persisting data generated by and used by Docker containers. Since containers are ephemeral, any data stored inside them is lost when the container is removed. Volumes store data on the host machine, ensuring it survives container restarts.

**24. What is a Docker network?**
A Docker network allows isolated containers to communicate with each other securely. By default, containers on the same network can discover each other using their container names as hostnames. We use this so our backend can talk to the database.

**25. Docker image tagging?**
Image tagging is a way to version Docker images. A tag is an alias pointing to a specific image ID, usually indicating a version number like `v1.0` or `latest`. Tagging is essential for rollbacks and maintaining different deployment versions.

**26. What is Docker Hub?**
Docker Hub is a cloud-based registry service where you can find and share container images with your team. It acts similarly to GitHub but for Docker images. Our CI pipeline builds images and pushes them to Docker Hub for deployment.

## Project-Specific

**27. What is Stock Pulse?**
Stock Pulse is a web application that provides real-time stock market data, allowing users to track stocks, manage a virtual portfolio, and monitor their profit and loss. It utilizes a modern frontend and backend architecture to deliver financial insights.

**28. What tech stack did you use and why?**
We used React for the frontend because of its component-based architecture and fast rendering. Node.js/Express was used for the backend for efficient asynchronous handling of API requests. MongoDB serves as the database due to its flexible document schema.

**29. How does authentication work?**
Authentication is implemented using JSON Web Tokens (JWT). When a user logs in, the backend verifies credentials and issues a JWT. The frontend stores this token and sends it in the Authorization header of subsequent requests to access protected routes.

**30. How does the stock data API work?**
The backend fetches real-time market data from external financial APIs like Alpha Vantage or Yahoo Finance. To optimize performance and avoid rate limits, the backend often caches these responses in memory or the database before sending them to the frontend.

**31. What is Alpha Vantage?**
Alpha Vantage is an API service that provides real-time and historical financial market data. We integrate it into our backend to retrieve stock quotes, charts, and fundamental data. Our backend acts as a middleman to secure our API keys.

**32. How does the mock data fallback work?**
Because free financial APIs have strict rate limits, we implemented a fallback mechanism. If the external API limit is reached or fails, our backend serves pre-recorded mock data. This ensures the application remains usable during demonstrations.

**33. How is P&L calculated?**
Profit and Loss (P&L) is calculated on the backend by comparing the user's average purchase price of a stock with its current real-time market price. The formula is `(Current Price - Purchase Price) * Quantity`. This is aggregated to show total portfolio performance.

**34. Explain the 3-tier architecture.**
Our project uses a 3-tier architecture: the Presentation Tier (React frontend), the Application Tier (Node.js backend), and the Data Tier (MongoDB). This separation of concerns improves scalability, security, and maintainability.

**35. How many Docker containers and why?**
We use three main containers: one for the React frontend (served via Nginx), one for the Node.js backend, and one for the MongoDB database. This isolation ensures each component runs in its optimal environment and can be scaled independently.

**36. Walk through the Jenkins pipeline stages.**
Our pipeline starts with the Checkout stage to get the code. The Build stage compiles code and builds Docker images. The Test stage runs unit tests. The Push stage uploads images to Docker Hub. Finally, the Deploy stage spins up containers using Docker Compose.

**37. How do tests run in the pipeline?**
Tests are defined in our `package.json` scripts. The Jenkins pipeline executes a shell step like `npm test` inside a temporary container or the Jenkins workspace. The pipeline checks the exit code; a zero means success, non-zero means failure.

**38. What happens if a test fails?**
If a test fails, the command returns a non-zero exit code. Jenkins detects this, immediately stops the pipeline execution, and marks the build as "Failed". It prevents broken code from proceeding to the deployment stage.

**39. How are Docker images tagged in the pipeline?**
We tag images using the Jenkins build number (`$BUILD_NUMBER`) or the Git commit hash to ensure every image has a unique identifier. This allows us to track exactly which version of the code is running in any environment.

**40. How does nginx proxy work?**
In our frontend container, Nginx serves the static React files. We also configure Nginx as a reverse proxy to forward API requests (e.g., `/api`) to the backend container. This solves CORS issues and simplifies the frontend configuration.

**41. What is JWT and how is it used?**
JWT (JSON Web Token) is a standard for securely transmitting information between parties as a JSON object. We use it for stateless authentication; the token contains the user ID and is signed securely, so the backend can verify user identity without querying the database every time.

**42. How does the frontend communicate with the backend?**
The React frontend communicates with the Node.js backend using HTTP REST APIs. It makes asynchronous requests using the `fetch` API or `axios` to endpoints like `/api/stocks` or `/api/users`, receiving data in JSON format to update the UI.

**43. What is CORS and why is it needed?**
CORS (Cross-Origin Resource Sharing) is a security feature in browsers that prevents a webpage from making requests to a different domain than the one that served the webpage. We configure CORS on our backend to explicitly allow requests from our React frontend's domain.
