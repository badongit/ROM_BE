import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { CreateTableBodyDto } from './dto/request/create-table.body.dto';
import { ListTableQueryDto } from './dto/request/list-table.query.dto';
import { UpdateTableBodyDto } from './dto/request/update-table.body.dto';
import { DetailTableResponseDto } from './dto/response/detail-table.response.dto';
import { TableResponseDto } from './dto/response/table.response.dto';
import { ITableService } from './interfaces/table.service.interface';

@Controller('table')
export class TableController {
  constructor(
    @Inject('ITableService')
    private readonly tableService: ITableService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create table' })
  @ApiResponse({ status: ResponseCodeEnum.CREATED })
  create(@Body() body: CreateTableBodyDto) {
    return this.tableService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List table' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: TableResponseDto })
  list(@Query() query: ListTableQueryDto) {
    return this.tableService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail table' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: DetailTableResponseDto })
  detail(@Param() params: IdParamsDto) {
    return this.tableService.detail(params);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Detail table' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  update(@Param() params: IdParamsDto, @Body() body: UpdateTableBodyDto) {
    return this.tableService.update({ ...params, ...body });
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tableService.remove(+id);
  // }
}
