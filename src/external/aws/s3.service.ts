import { S3 } from 'aws-sdk'
import { Container } from '../../shared/lib/container'
import { AWS_S3 } from '../../config/aws.config'

export class AwsS3Service {
  constructor(private readonly s3: S3) {}

  async uploadFile(
    bucket: string,
    file: Express.Multer.File,
    key: string,
    options?: Partial<S3.PutObjectAclRequest>
  ): Promise<string> {
    const { Location } = await this.s3
      .upload({
        ...options,
        Bucket: bucket,
        Body: file.buffer,
        Key: key
      })
      .promise()
    return Location
  }
}
Container.register(AwsS3Service, [AWS_S3])
