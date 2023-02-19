pipeline {
  agent { node { label 'node18' } }
  
  stages {
    stage('test'){
      steps {
        container('nodejs') {
          sh('npm ci')   
        }
      }
    }

    stage('Parallel') {
      parallel {
        stage('build') {
          steps {
            container('nodejs') {
              sh('npm run build')   
            }
          }
        }

        stage('test') {
          steps {
            container('nodejs') {
              sh('npm run test')
            }
          }
        }
      }
    }
  }
}