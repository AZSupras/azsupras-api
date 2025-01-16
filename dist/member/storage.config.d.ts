/// <reference types="multer" />
/// <reference types="cookie-parser" />
import { Request } from 'express';
interface StorageConfigProps {
    directory?: ((req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => void) | string | undefined;
    fileName?: ((req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => void) | undefined;
}
declare const storageConfig: ({ fileName, directory }: StorageConfigProps) => import("multer").StorageEngine;
export { storageConfig };
