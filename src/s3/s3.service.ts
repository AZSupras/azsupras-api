import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
    private readonly bucketName: string
    private readonly region: string
    private readonly endpoint: string
    private readonly accessKeyId: string
    private readonly secretAccessKey: string
    private readonly s3: AWS.S3

    constructor(
        @Inject(ConfigService)
        private readonly configService: ConfigService,) {
        this.bucketName = this.configService.get<string>('DO_SPACES_BUCKET')
        this.region = this.configService.get<string>('DO_SPACES_REGION')
        this.endpoint = this.configService.get<string>('DO_SPACES_ENDPOINT')
        this.accessKeyId = this.configService.get<string>('DO_SPACES_KEY')
        this.secretAccessKey = this.configService.get<string>('DO_SPACES_SECRET')

        this.s3 = new AWS.S3({
            region: '',
            endpoint: this.endpoint,
            accessKeyId: this.accessKeyId,
            secretAccessKey: this.secretAccessKey,
        })
    }

    async uploadFile(file: Express.Multer.File, path?: string | undefined): Promise<AWS.S3.ManagedUpload.SendData> {
      console.log(file);
      const { originalname } = file;
  
      return await this.s3_upload(
        file.buffer,
        `${this.bucketName}${path ? (path.charAt(0) === '/' ? path : `/${path}`) : null}`,
        originalname,
        file.mimetype,
      );
    }

    async deleteFile(file: string): Promise<AWS.S3.DeleteObjectOutput> {
      return await this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: file,
      }).promise();
    }
  
    async s3_upload(file, bucket, name, mimetype) {
      const params = {
        Bucket: bucket,
        Key: String(name),
        Body: file,
        ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: 'ap-south-1',
        },
      };
  
      try {
        let s3Response = await this.s3.upload(params).promise();
        return s3Response;
      } catch (e) {
        console.log(e);
      }
    }
}
