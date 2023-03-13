import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { FILE_CONSTANT } from '@src/constants/common';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { ApiError } from '@src/utils/api-error';

@Injectable()
export class FileValidatonPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value) {
      const { mimetype, size } = value;

      const mimetypeAccept = ['image/jpeg', 'image/png'];

      if (!mimetypeAccept.includes(mimetype)) {
        throw new BadRequestException(
          new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            MessageEnum.FILE_TYPE_NOT_ALLOW,
          ).toResponse(),
        );
      }

      if (size > FILE_CONSTANT.MAX_FILE_SIZE) {
        throw new BadRequestException(
          new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            MessageEnum.FILE_SIZE_EXCEEDED_ALLOW,
          ).toResponse(),
        );
      }
    }

    return value;
  }
}
