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

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(
    @Inject('ICategoryService')
    private readonly categoryService: ICategoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: ResponseCodeEnum.CREATED })
  create(@Body() body: CreateCategoryBodyDto) {
    return this.categoryService.create(body);
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
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  update(@Param() params: IdParamsDto, @Body() body: UpdateCategoryBodyDto) {
    return this.categoryService.update({ ...params, ...body });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  remove(@Param() params: IdParamsDto) {
    return this.categoryService.delete(params);
  }
}
