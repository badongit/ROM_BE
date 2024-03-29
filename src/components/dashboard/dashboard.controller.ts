import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IDashboardService } from './interfaces/dashboard.service.interface';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { SyntheticResponseDto } from './dto/response/synthetic.response.dto';
import { SummaryOrderResponseDto } from './dto/request/summary-order.response.dto';
import { RevenueStatisticsRequestDto } from './dto/request/revenue-statistics.request.dto';
import { OrderStatisticsRequestDto } from './dto/request/order-statistics.request.dto';
import { OrderStatisticsResponseDto } from './dto/response/order-statistics.response.dto';
import { RevenueStatisticsResponseDto } from './dto/response/revenue-statistics.response.dto';
import { PaginationQueryDto } from '@src/core/dto/request/pagination.query.dto';
import { CustomerOrderStatisticsResponseDto } from './dto/response/customer-order-statistics.response.dto';
import { DishOrderStatisticsResponseDto } from './dto/response/dish-order-statistics.response.dto';

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject('IDashboardService')
    private readonly dashboardService: IDashboardService,
  ) {}

  @Get('summary')
  @ApiOperation({ summary: 'Synthetic' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: SyntheticResponseDto })
  synthetic() {
    return this.dashboardService.synthetic();
  }

  @Get('order')
  @ApiOperation({ summary: 'Summary order' })
  @ApiResponse({
    status: ResponseCodeEnum.OK,
    type: OrderStatisticsResponseDto,
  })
  summaryOrder(@Query() query: OrderStatisticsRequestDto) {
    return this.dashboardService.orderStatistics(query);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Summary order' })
  @ApiResponse({
    status: ResponseCodeEnum.OK,
    type: RevenueStatisticsResponseDto,
  })
  revenueStatistics(@Query() query: RevenueStatisticsRequestDto) {
    return this.dashboardService.revenueStatistics(query);
  }

  @Get('dishes')
  @ApiOperation({ summary: 'Summary dish order' })
  @ApiResponse({
    status: ResponseCodeEnum.OK,
    type: DishOrderStatisticsResponseDto,
  })
  dishOrderStatistics(@Query() query: PaginationQueryDto) {
    return this.dashboardService.dishOrderStatistics(query);
  }

  @Get('customers')
  @ApiOperation({ summary: 'Summary customer order' })
  @ApiResponse({
    status: ResponseCodeEnum.OK,
    type: CustomerOrderStatisticsResponseDto,
  })
  customerOrderStatistics(@Query() query: PaginationQueryDto) {
    return this.dashboardService.customerOrderStatistics(query);
  }
}
