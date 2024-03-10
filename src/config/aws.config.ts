import { S3 } from 'aws-sdk'
import { Provider } from '../shared/lib/container'

export const AwsS3Config: S3.ClientConfiguration = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET
  }
}

export const AWS_S3 = 'aws-s3'
export const AwsS3Provider: Provider<S3> = {
  provide: AWS_S3,
  useFactory() {
    return new S3(AwsS3Config)
  }
}
