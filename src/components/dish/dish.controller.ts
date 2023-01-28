import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Inject,
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
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: ResponseCodeEnum.CREATED })
  create(@Body() body: CreateDishBodyDto) {
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
  @ApiOperation({ summary: 'Update' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  update(@Param() params: IdParamsDto, @Body() body: UpdateDishBodyDto) {
    return this.dishService.update({ ...params, ...body });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  delete(@Param() params: IdParamsDto) {
    return this.dishService.delete(params);
  }
}
