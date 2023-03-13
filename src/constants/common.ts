import * as dotenv from 'dotenv';
dotenv.config();

export const JWT_CONSTANT = {
  ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
};

export const REDIS_CONSTANT = {
  HOST: process.env.REDIS_HOST,
  PORT: process.env.REDIS_PORT,
  PASS: process.env.REDIS_PASS,
};

export const FILE_CONSTANT = {
  MAX_FILE_SIZE: +process.env.MAX_FILE_SIZE,
  FILE_FOLDER: './uploads',
};

export const SUCCESS_CODE = [200, 201];
