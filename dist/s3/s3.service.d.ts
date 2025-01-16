import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
export declare class S3Service {
    private readonly configService;
    private readonly bucketName;
    private readonly region;
    private readonly endpoint;
    private readonly accessKeyId;
    private readonly secretAccessKey;
    private readonly s3;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, path?: string | undefined): Promise<AWS.S3.ManagedUpload.SendData>;
    deleteFile(file: string): Promise<AWS.S3.DeleteObjectOutput>;
    s3_upload(file: any, bucket: any, name: any, mimetype: any): Promise<AWS.S3.ManagedUpload.SendData>;
}
