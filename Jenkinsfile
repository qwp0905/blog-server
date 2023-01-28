pipeline {
  agent { node { label 'agent' } }

  triggers { 
    pollSCM('* * * * *')
  }

  environment {
    APP                   = 'blog-server'
    AWS_ACCESS_KEY_ID     = credentials('aws-access-key-id')
    AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
    AWS_ECR_REGISTRY      = credentials('aws-ecr-registry')
    MESSAGE               = "$JOB_NAME#$BUILD_NUMBER $BUILD_URL"
  }

  stages {
    stage('Initialization') {
      parallel {
        stage('Set Build Name') {
          environment {
            COMMIT_MESSAGE = "${sh(returnStdout: true, script: 'git log -1 --pretty=%B | head -n 1')}"
          }

          steps {
            buildName("[$BUILD_NUMBER] $COMMIT_MESSAGE")
          }
        }

        stage('Configure Aws Credentials') {
          environment {
            RANDOM_STRING = UUID.randomUUID().toString()
          }

          steps {
            container('aws-cli') {
              sh('aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID')
              sh('aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY')

              sh('aws ecr get-login-password --region ap-northeast-2 > $RANDOM_STRING.txt')
            }

            container('docker') {
              sh('cat $RANDOM_STRING.txt | docker login -u AWS --password-stdin $AWS_ECR_REGISTRY')
            }

            container('helm') {
              sh('cat $RANDOM_STRING.txt | helm registry login -u AWS --password-stdin $AWS_ECR_REGISTRY')
            }

            sh('rm -f $RANDOM_STRING.txt')
          }
        }
      }
    }

    stage('Build & Push') {
      environment {
        COMMIT_HASH = "${sh(returnStdout: true, script: 'git log -1 --format=%H | head -n 1')}"
      }

      steps {
        container('docker') {
          sh('docker build --platform linux/amd64 -f prod.Dockerfile -t $AWS_ECR_REGISTRY/$APP:$COMMIT_HASH .')
          sh('docker push $AWS_ECR_REGISTRY/$APP:$COMMIT_HASH')
        }
      }
    }

    stage('Deploy') {
      steps {
        container('helm') {
          sh('echo "image: $AWS_ECR_REGISTRY/$APP:$COMMIT_HASH" >> helm/values.yml')
          sh('helm upgrade --install $APP oci://$AWS_ECR_REGISTRY/service-helm -f helm/values.yml')
        }
      }
    }
  }

  post {
    success {
      slackSend(channel: 'testtest', color: 'good', message: "Success $MESSAGE")
    }
    failure {
      slackSend(channel: 'testtest', color: 'danger', message: "Failed $MESSAGE")
    }
    unstable {
      slackSend(channel: 'testtest', color: 'warning', message: "Unstable $MESSAGE")
    }
  }
}
