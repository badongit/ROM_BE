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
import { ChangeStatusTableBodyDto } from './dto/request/change-status-table.body.dto';
import { CreateTableBodyDto } from './dto/request/create-table.body.dto';
import { ListTableQueryDto } from './dto/request/list-table.query.dto';
import { UpdateTableBodyDto } from './dto/request/update-table.body.dto';
import { DetailTableResponseDto } from './dto/response/detail-table.response.dto';
import { TableResponseDto } from './dto/response/table.response.dto';
import { ITableService } from './interfaces/table.service.interface';

@ApiBearerAuth()
@ApiTags('Tables')
@Controller('tables')
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

  @Patch('/:id/status')
  @ApiOperation({ summary: 'Update status table' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  changeStatus(
    @Param() params: IdParamsDto,
    @Body() body: ChangeStatusTableBodyDto,
  ) {
    return this.tableService.changeStatus({ ...params, ...body });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update table' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  update(@Param() params: IdParamsDto, @Body() body: UpdateTableBodyDto) {
    return this.tableService.update({ ...params, ...body });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete table' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  remove(@Param() params: IdParamsDto) {
    return this.tableService.delete(params);
  }
}
