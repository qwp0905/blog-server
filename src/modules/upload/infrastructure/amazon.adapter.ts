import { extname } from 'path'
import { AwsS3Service } from '../../../external/aws/s3.service'
import { IAmazonAdapter } from '../interface/adapters/amazon.adapter.interface'
import { Container } from '../../../shared/lib/container'

export class AmazonAdapter implements IAmazonAdapter {
  constructor(private readonly s3Service: AwsS3Service) {}

  uploadFile(file: Express.Multer.File): Promise<string> {
    return this.s3Service.uploadFile(
      process.env.AWS_BLOG_IMAGE_BUCKET,
      file,
      `article_images/${+new Date()}${extname(file.originalname)}`
    )
  }
}
Container.register(AmazonAdapter, [AwsS3Service])
