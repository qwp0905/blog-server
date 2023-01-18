pipeline {
  agent { node { label 'docker' } }
  
  environment {
    APP                   = 'blog-server'
    AWS_ACCESS_KEY_ID     = credentials('aws-access-key-id')
    AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
    AWS_ECR_REGISTRY      = credentials('aws-ecr-registry')
    RANDOM_STRING         = UUID.randomUUID().toString()
  }

  stages {
    stage('Set Build Name') {
      environment {
        COMMIT_MESSAGE = "${sh(returnStdout: true, script: 'git log -1 --pretty=%B | head -n 1')}"
      }
      steps {
        buildName("[$BUILD_NUMBER] $COMMIT_MESSAGE")
      }
    }

    stage('Configure Aws Credentials') {
      steps {
        container('aws-cli') {
          sh('aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID')
          sh('aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY')

          sh('aws ecr get-login-password --region ap-northeast-2 > $RANDOM_STRING.txt')
        }

        container('docker') {
          sh('cat $RANDOM_STRING.txt | docker login -u AWS --password-stdin $AWS_ECR_REGISTRY')
          sh('rm -f $RANDOM_STRING.txt')
        }
      }
    }

    stage('Build & Push') {
      environment {
        GIT_COMMIT = "${sh(returnStdout: true, script: 'git log -1 --format=%H | head -n 1')}"
      }

      steps {
        container('docker') {
          sh('docker build --platform linux/amd64 -f prod.Dockerfile -t $AWS_ECR_REGISTRY/$APP:$GIT_COMMIT .')
          sh('docker push $AWS_ECR_REGISTRY/$APP:$GIT_COMMIT')
        }
      }
    }
  }
}
