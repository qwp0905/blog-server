import { PutObjectAclRequest } from 'aws-sdk/clients/s3'
import { AwsS3Service } from '../../../external/aws/s3.service'
import { IAmazonAdapter } from '../interface/adapter/amazon.adapter.interface'

export class AmazonAdapter implements IAmazonAdapter {
  constructor(private readonly s3Service: AwsS3Service) {}

  uploadFile(
    file: Express.Multer.File,
    options?: Partial<PutObjectAclRequest>
  ): Promise<string> {
    return this.s3Service.uploadFile('ootd13image', file, options)
  }
}
