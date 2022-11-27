import { S3 } from 'aws-sdk'

export interface IAmazonAdapter {
  uploadFile: (
    file: Express.Multer.File,
    options?: Partial<S3.PutObjectAclRequest>
  ) => Promise<string>
}
