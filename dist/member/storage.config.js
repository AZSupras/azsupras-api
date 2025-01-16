"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageConfig = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const storageConfig = ({ fileName, directory }) => {
    return (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            const memberId = req.params.id;
            console.log('memberId:', memberId);
            if (typeof directory === 'function') {
                directory(req, file, cb);
            }
            else {
                const path = directory ? `${directory}/${memberId}` : memberId;
                const uploadPath = (0, path_1.join)(__dirname, '..', 'uploads', path);
                console.log('uploadPath:', uploadPath);
                cb(null, uploadPath);
            }
        },
        filename: fileName ? fileName : (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });
};
exports.storageConfig = storageConfig;
//# sourceMappingURL=storage.config.js.map