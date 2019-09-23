pipeline {
    agent any
    // agent {
    //     docker {
    //         image 'node'
    //     }
    // }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: ''
            }
        }
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run-script build'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                }
            }
        }
        stage('Test') {
            steps {
                sh 'npm run-script lint'
                sh 'npm run-script test'
                junit 'junit.xml'
            }
        }
        // stage('Deploy') {
        //     steps {
        //         catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
        //             sh 'npm run-script deploy-functions'
        //         }
        //     }
        // }
    }
}