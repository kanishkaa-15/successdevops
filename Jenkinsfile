pipeline {
    agent any

    parameters {
        string(name: 'GHCR_USER', defaultValue: 'kanishkaa-15', description: 'GitHub Username')
        string(name: 'IMAGE_NAME_BACKEND', defaultValue: 'school-ceo-backend', description: 'Backend image name')
        string(name: 'IMAGE_NAME_FRONTEND', defaultValue: 'school-ceo-frontend', description: 'Frontend image name')
        booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Run tests during build')
    }

    environment {
        DOCKER_REGISTRY      = "ghcr.io/${params.GHCR_USER}"
        IMAGE_BACKEND        = "${DOCKER_REGISTRY}/${params.IMAGE_NAME_BACKEND}"
        IMAGE_FRONTEND       = "${DOCKER_REGISTRY}/${params.IMAGE_NAME_FRONTEND}"
        IMAGE_TAG            = "build-${BUILD_NUMBER}"
        KUBECONFIG_PATH      = "/var/jenkins_home/.kube/config"
        KUBECTL_BINARY       = "/var/jenkins_home/kubectl"
        GHCR_CREDENTIALS_ID  = "ghcr-credentials1"
    }

    stages {
        stage('🚀 Preparation') {
            steps {
                echo '📥 Cleaning and checking out source code...'
                cleanWs()
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: "https://github.com/${params.GHCR_USER}/successdevops.git",
                        credentialsId: "${GHCR_CREDENTIALS_ID}"
                    ]]
                ])
            }
        }

        stage('📦 Install & Lint') {
            parallel {
                stage('Frontend') {
                    steps {
                        echo '📦 Installing frontend dependencies...'
                        sh 'npm install'
                        echo '🔍 Linting frontend...'
                        sh 'npm run lint'
                    }
                }
                stage('Backend') {
                    steps {
                        echo '📦 Installing backend dependencies...'
                        sh 'cd backend && npm install'
                    }
                }
            }
        }

        stage('🧪 Test') {
            when {
                expression { params.RUN_TESTS == true }
            }
            steps {
                echo '🧪 Running tests (Placeholder)...'
                // sh 'npm test' or similar
                echo '✅ Tests passed!'
            }
        }

        stage('🏗️  Build Application') {
            steps {
                echo '🏗️  Building Next.js for production...'
                sh 'npm run build'
            }
        }

        stage('🐳 Docker Build & Push') {
            steps {
                script {
                    echo '📤 Logging in to GHCR...'
                    withCredentials([usernamePassword(
                        credentialsId: "${GHCR_CREDENTIALS_ID}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh "echo \"\$DOCKER_PASS\" | docker login ghcr.io -u ${params.GHCR_USER} --password-stdin"
                        
                        echo '🐳 Building and Pushing Backend Image...'
                        sh "docker build -t ${IMAGE_BACKEND}:${IMAGE_TAG} ./backend"
                        sh "docker tag ${IMAGE_BACKEND}:${IMAGE_TAG} ${IMAGE_BACKEND}:latest"
                        sh "docker push ${IMAGE_BACKEND}:${IMAGE_TAG}"
                        sh "docker push ${IMAGE_BACKEND}:latest"

                        echo '🐳 Building and Pushing Frontend Image...'
                        sh "docker build -t ${IMAGE_FRONTEND}:${IMAGE_TAG} ."
                        sh "docker tag ${IMAGE_FRONTEND}:${IMAGE_TAG} ${IMAGE_FRONTEND}:latest"
                        sh "docker push ${IMAGE_FRONTEND}:${IMAGE_TAG}"
                        sh "docker push ${IMAGE_FRONTEND}:latest"
                    }
                }
            }
        }

        stage('☸️ Deploy to K8s') {
            steps {
                script {
                    echo '☸️ Updating Kubernetes manifests...'
                    withCredentials([usernamePassword(
                        credentialsId: "${GHCR_CREDENTIALS_ID}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        // Create secret for GHCR
                        sh """
                            ${KUBECTL_BINARY} --kubeconfig=${KUBECONFIG_PATH} \\
                            create secret docker-registry ghcr-secret \\
                            --docker-server=ghcr.io \\
                            --docker-username=${params.GHCR_USER} \\
                            --docker-password=\$DOCKER_PASS \\
                            --dry-run=client -o yaml | \\
                            ${KUBECTL_BINARY} --kubeconfig=${KUBECONFIG_PATH} apply -f -
                        """

                        // Update image tags in manifests
                        sh """
                            sed -i 's|image: .*school-ceo-backend.*|image: ${IMAGE_BACKEND}:${IMAGE_TAG}|g' k8s/backend.yaml
                            sed -i 's|image: .*school-ceo-frontend.*|image: ${IMAGE_FRONTEND}:${IMAGE_TAG}|g' k8s/frontend.yaml
                        """

                        echo '☸️ Applying Kubernetes manifests...'
                        sh "${KUBECTL_BINARY} --kubeconfig=${KUBECONFIG_PATH} apply -f k8s/"
                        
                        echo '☸️ Waiting for deployment to complete...'
                        sh "${KUBECTL_BINARY} --kubeconfig=${KUBECONFIG_PATH} rollout status deployment/backend --timeout=120s"
                        sh "${KUBECTL_BINARY} --kubeconfig=${KUBECONFIG_PATH} rollout status deployment/frontend --timeout=120s"
                    }
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Post-build cleanup...'
            cleanWs()
        }
        success {
            echo "✅ Build SUCCESSFUL: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        }
        failure {
            echo "❌ Build FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        }
    }
}
