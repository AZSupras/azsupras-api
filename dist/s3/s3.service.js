"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const AWS = require("aws-sdk");
let S3Service = class S3Service {
    constructor(configService) {
        this.configService = configService;
        this.bucketName = this.configService.get('DO_SPACES_BUCKET');
        this.region = this.configService.get('DO_SPACES_REGION');
        this.endpoint = this.configService.get('DO_SPACES_ENDPOINT');
        this.accessKeyId = this.configService.get('DO_SPACES_KEY');
        this.secretAccessKey = this.configService.get('DO_SPACES_SECRET');
        this.s3 = new AWS.S3({
            region: '',
            endpoint: this.endpoint,
            accessKeyId: this.accessKeyId,
            secretAccessKey: this.secretAccessKey,
        });
    }
    async uploadFile(file, path) {
        console.log(file);
        const { originalname } = file;
        return await this.s3_upload(file.buffer, `${this.bucketName}${path ? (path.charAt(0) === '/' ? path : `/${path}`) : null}`, originalname, file.mimetype);
    }
    async deleteFile(file) {
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
        }
        catch (e) {
            console.log(e);
        }
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(config_1.ConfigService)),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map