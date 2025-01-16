import { Request } from 'express';
import { diskStorage } from 'multer';
import { join } from 'path';


interface StorageConfigProps {
  directory?: ((req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => void) | string | undefined;
  fileName?: ((req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => void) | undefined;
}

const storageConfig = ({ fileName, directory}: StorageConfigProps) => {
  return diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const memberId = req.params.id;
      console.log('memberId:', memberId);

      if (typeof directory === 'function') {
        directory(req, file, cb);
      } else {
        const path = directory ? `${directory}/${memberId}` : memberId;
        const uploadPath = join(__dirname, '..', 'uploads', path);
        console.log('uploadPath:', uploadPath);
        cb(null, uploadPath);
      }
    },
    filename: fileName ? fileName : (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
};

export { storageConfig };