import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { MessageEnum } from 'src/constants/enum/message.enum';
import { ResponseCodeEnum } from 'src/constants/enum/response-code.enum';
import { ApiError } from 'src/utils/api-error';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException(
        new ApiError(ResponseCodeEnum.BAD_REQUEST, MessageEnum.BAD_REQUEST)
          .withErrors(this.formatError(errors))
          .toResponse(),
      );
    }
    return object;
  }

  private formatError(errors: any[]) {
    const errObj: any = {};
    errors.forEach((error) => {
      for (const key in error.constraints) {
        errObj[error.property] = error.constraints[key];
        break;
      }
    });

    return errObj;
  }
}
