import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { FILE_CONSTANT } from '@src/constants/common';

export const multerDiskStorage = diskStorage({
  destination: FILE_CONSTANT.FILE_FOLDER,
  filename(req: any, file, callback) {
    const fileName =
      randomString(10) + '-' + Date.now() + path.parse(file.originalname).ext;
    console.log('🚀 ~ file: common.ts:10 ~ filename ~ fileName:', fileName);
    file.filename = fileName;

    callback(null, fileName);
  },
});

export const removeFile = (filename: string) => {
  fs.unlink(`${FILE_CONSTANT.FILE_FOLDER}/${filename}`, (err) => {
    if (err) {
      console.log('remove file error: ', err?.message || err);
    }
  });
};

export const randomString = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
