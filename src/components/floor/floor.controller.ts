import { FloorResponseDto } from './dto/response/floor.response.dto';
import { ResponseCodeEnum } from 'src/constants/enum/response-code.enum';
import { ListFloorQueryDto } from './dto/request/list-floor.query.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { FloorService } from './floor.service';
import { CreateFloorBodyDto } from './dto/request/create-floor.body.dto';
import { UpdateFloorBodyDto } from './dto/request/update-floor.body.dto';
import { Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DetailFloorResponseDto } from './dto/response/detail-floor.response.dto';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { IFloorService } from './interfaces/floor.service.interface';

@ApiBearerAuth()
@ApiTags('Floors')
@Controller('floors')
export class FloorController {
  constructor(
    @Inject('IFloorService')
    private readonly floorService: IFloorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create floor' })
  @ApiResponse({ status: ResponseCodeEnum.CREATED })
  create(@Body() body: CreateFloorBodyDto) {
    return this.floorService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List floor' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: FloorResponseDto })
  list(@Query() query: ListFloorQueryDto) {
    return this.floorService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail floor' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: DetailFloorResponseDto })
  findOne(@Param() params: IdParamsDto) {
    return this.floorService.detail(params);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update floor' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  update(
    @Param() params: IdParamsDto,
    @Body() updateFloorBodyDto: UpdateFloorBodyDto,
  ) {
    return this.floorService.update({ ...params, ...updateFloorBodyDto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete floor' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  delete(@Param() params: IdParamsDto) {
    return this.floorService.delete(params);
  }
}
