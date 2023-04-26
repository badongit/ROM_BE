import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { CreateCategoryBodyDto } from './dto/request/create-category.body.dto';
import { ListCategoryQueryDto } from './dto/request/list-category.query.dto';
import { UpdateCategoryBodyDto } from './dto/request/update-category.body.dto';
import { CategoryResponseDto } from './dto/response/category.response.dto';
import { DetailCategoryResponseDto } from './dto/response/detail-category.response.dto';
import { ICategoryService } from './interfaces/category.service.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidatonPipe } from '@src/core/pipes/file-validation.pipe';
import { removeFile } from '@src/utils/common';
import { SUCCESS_CODE } from '@src/constants/common';

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(
    @Inject('ICategoryService')
    private readonly categoryService: ICategoryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: ResponseCodeEnum.CREATED })
  async create(
    @Body() body: CreateCategoryBodyDto,
    @UploadedFile(FileValidatonPipe) file: Express.Multer.File,
  ) {
    body.image = file;
    const response = await this.categoryService.create(body);

    if (file && !SUCCESS_CODE.includes(response.statusCode)) {
      removeFile(file.filename);
    }

    return response;
  }

  @Get()
  @ApiOperation({ summary: 'List category' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: CategoryResponseDto })
  list(@Query() query: ListCategoryQueryDto) {
    return this.categoryService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail category' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: DetailCategoryResponseDto })
  detail(@Param() params: IdParamsDto) {
    return this.categoryService.detail(params);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  async update(
    @Param() params: IdParamsDto,
    @Body() body: UpdateCategoryBodyDto,
    @UploadedFile(FileValidatonPipe) file?: Express.Multer.File,
  ) {
    if (file) {
      body.image = file;
    }
    const response = await this.categoryService.update({ ...params, ...body });

    if (file && !SUCCESS_CODE.includes(response.statusCode)) {
      removeFile(file.filename);
    }

    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  remove(@Param() params: IdParamsDto) {
    return this.categoryService.delete(params);
  }
}
