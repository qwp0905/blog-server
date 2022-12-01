export interface IAmazonAdapter {
  uploadFile: (file: Express.Multer.File) => Promise<string>
}
