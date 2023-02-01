pipeline {
  agent { node { label 'agent' } }

  parameters { 
    string(
      name: 'DEPLOY_TAG',
      defaultValue: "",
      description: 'Deploy tag'
    )
  }

  environment {
    APP              = 'blog-server'
    AWS_ECR_REGISTRY = credentials('aws-ecr-registry')
    COMMIT_MESSAGE   = "${sh(returnStdout: true, script: 'git log $DEPLOY_TAG -1 --pretty=%B | head -n 1')}"
    MESSAGE          = "$JOB_NAME#$BUILD_NUMBER\n$COMMIT_MESSAGE\n$BUILD_URL"
  }

  stages {
    stage('Initialization') {
      parallel {
        stage('Set Build Name') {
          script {
            if (!env.DEPLOY_TAG) {
              env.DEPLOY_TAG = "${sh(returnStdout: true, script: 'git log -1 --pretty=%H | head -n 1')}"
            }
          }

          steps {
            sh('git switch --detach $DEPLOY_TAG')
            buildName("[$BUILD_NUMBER] $COMMIT_MESSAGE")
          }
        }

        stage('Configure Aws Credentials') {
          environment {
            RANDOM_STRING = UUID.randomUUID().toString()
          }

          steps {
            container('aws-cli') {
              sh('aws ecr get-login-password --region ap-northeast-2 > $RANDOM_STRING.txt')
            }

            container('helm') {
              sh('cat $RANDOM_STRING.txt | helm registry login -u AWS --password-stdin $AWS_ECR_REGISTRY')
            }

            sh('rm -f $RANDOM_STRING.txt')
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        container('helm') {
          sh('echo "image: $AWS_ECR_REGISTRY/$APP:$DEPLOY_TAG" >> helm/values.yml')
          sh('helm upgrade --install $APP oci://$AWS_ECR_REGISTRY/service-helm -f helm/values.yml -n default')
        }
      }
    }
  }

  post {
    success {
      slackSend(channel: 'testtest', color: 'good', message: "[Success] $MESSAGE")
    }
    failure {
      slackSend(channel: 'testtest', color: 'danger', message: "[Failed] $MESSAGE")
    }
    unstable {
      slackSend(channel: 'testtest', color: 'warning', message: "[Unstable] $MESSAGE")
    }
  }
}
