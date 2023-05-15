import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { SyntheticResponseDto } from '../dto/response/synthetic.response.dto';
import { SummaryOrderResponseDto } from '../dto/request/summary-order.response.dto';
import { DashboardTimeRequestDto } from '../dto/request/dashboard-time.request.dto';
import { RevenueStatisticsRequestDto } from '../dto/request/revenue-statistics.request.dto';
import { OrderStatisticsRequestDto } from '../dto/request/order-statistics.request.dto';
import { RevenueStatisticsResponseDto } from '../dto/response/revenue-statistics.response.dto';
import { OrderStatisticsResponseDto } from '../dto/response/order-statistics.response.dto';

export interface IDashboardService {
  synthetic(): Promise<ResponsePayload<SyntheticResponseDto>>;
  summaryOrder(
    request: DashboardTimeRequestDto,
  ): Promise<ResponsePayload<SummaryOrderResponseDto>>;
  revenueStatistics(
    request: RevenueStatisticsRequestDto,
  ): Promise<ResponsePayload<RevenueStatisticsResponseDto>>;
  orderStatistics(
    request: OrderStatisticsRequestDto,
  ): Promise<ResponsePayload<OrderStatisticsResponseDto>>;
}
