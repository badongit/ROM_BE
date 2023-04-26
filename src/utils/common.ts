import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as dayjs from 'dayjs';
import { FILE_CONSTANT } from '@src/constants/common';
import { divide, multiply, subtract } from 'lodash';
import { EXCHANGE_RATE } from '@src/components/order/constants';

export const multerDiskStorage = diskStorage({
  destination: FILE_CONSTANT.FILE_FOLDER,
  filename(req: any, file, callback) {
    if (file) {
      const fileName =
        randomString(10) + '-' + Date.now() + path.parse(file.originalname).ext;
      file.filename = fileName;

      callback(null, fileName);
    } else {
      callback(null, null);
    }
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

export const formatDateToOrderCode = (date?: Date): string => {
  return dayjs(date || new Date()).format('YYMMDDHHmmss');
};

export const amountToPoint = (amount: number): number => {
  if (amount === 0) return 0;
  return Math.floor(multiply(5, divide(amount, multiply(100, EXCHANGE_RATE))));
};

export const discountAmount = (
  amount: number,
  point: number,
): { amount: number; point: number } => {
  const asPoint = divide(amount, EXCHANGE_RATE);

  if (asPoint >= point) {
    return {
      amount: subtract(amount, multiply(point, EXCHANGE_RATE)),
      point: 0,
    };
  } else {
    return {
      amount: 0,
      point: subtract(point, asPoint),
    };
  }
};
