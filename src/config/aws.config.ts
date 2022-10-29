import { S3 } from 'aws-sdk'

export const AwsS3Config: S3.ClientConfiguration = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET
  }
}
