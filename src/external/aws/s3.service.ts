import { S3 } from 'aws-sdk'

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
