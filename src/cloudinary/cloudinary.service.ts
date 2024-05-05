import { Injectable } from '@nestjs/common';
import toStream = require('buffer-to-stream');
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadArchive(
    fileName: Express.Multer.File,
    type: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.config({
        cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
        api_key: `${process.env.CLOUDINARY_API_KEY}`,
        api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
      });
      
      let upload;

      if (type == 'image')
        upload = v2.uploader.upload_stream(
          { public_id: fileName.originalname.split('.').at(0) },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
      else {
        upload = v2.uploader.upload_stream(
          { resource_type: 'video', public_id: fileName.originalname.split('.').at(0) },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
      }

      toStream(fileName.buffer).pipe(upload);
    });
  }
}
