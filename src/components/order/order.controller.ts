import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { IOrderService } from './interfaces/order.service.interface';
import { OrderResponseDto } from './dto/response/order.response.dto';
import { DetailOrderResponseDto } from './dto/response/detail-order.response.dto';
import { ListOrderQueryDto } from './dto/request/list-order.query.dto';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';

@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    @Inject('IOrderService')
    private readonly orderService: IOrderService,
  ) {}
  @Get()
  @ApiOperation({ summary: 'List order' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: DetailOrderResponseDto })
  list(@Query() query: ListOrderQueryDto) {
    return this.orderService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail order' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: DetailOrderResponseDto })
  detail(@Param() params: IdParamsDto) {
    return this.orderService.detail(params);
  }
}
