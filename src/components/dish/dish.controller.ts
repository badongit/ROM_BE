import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SUCCESS_CODE } from '@src/constants/common';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { FileValidatonPipe } from '@src/core/pipes/file-validation.pipe';
import { ApiError } from '@src/utils/api-error';
import { removeFile } from '@src/utils/common';
import { ResponseBuilder } from '@src/utils/response-builder';
import { CreateDishBodyDto } from './dto/request/creat-dish.body.dto';
import { ListDishQueryDto } from './dto/request/list-dish.query.dto';
import { UpdateDishBodyDto } from './dto/request/update-dish.body.dto';
import { DetailDishResponseDto } from './dto/response/detail-dish.response.dto';
import { DishResponseDto } from './dto/response/dish.response.dto';
import { IDishService } from './interfaces/dish.service.interface';

@ApiBearerAuth()
@ApiTags('Dishes')
@Controller('dishes')
export class DishController {
  constructor(
    @Inject('IDishService')
    private readonly dishService: IDishService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: ResponseCodeEnum.CREATED })
  create(
    @Body() body: CreateDishBodyDto,
    @UploadedFile(FileValidatonPipe) file: Express.Multer.File,
  ) {
    body.image = file;
    return this.dishService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: DishResponseDto })
  list(@Query() query: ListDishQueryDto) {
    return this.dishService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: DetailDishResponseDto })
  detail(@Param() params: IdParamsDto) {
    return this.dishService.detail(params);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  async update(
    @Param() params: IdParamsDto,
    @Body() body: UpdateDishBodyDto,
    @UploadedFile(FileValidatonPipe) file?: Express.Multer.File,
  ) {
    body.image = file;
    const response = await this.dishService.update({ ...params, ...body });

    if (file && !SUCCESS_CODE.includes(response.statusCode)) {
      removeFile(file.filename);
    }

    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  delete(@Param() params: IdParamsDto) {
    return this.dishService.delete(params);
  }
}
