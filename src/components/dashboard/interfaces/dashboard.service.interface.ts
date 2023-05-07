import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { SyntheticResponseDto } from '../dto/synthetic.response.dto';
import { SummaryOrderResponseDto } from '../dto/summary-order.response.dto';
import { DashboardTimeRequestDto } from '../dto/dashboard-time.request.dto';

export interface IDashboardService {
  synthetic(): Promise<ResponsePayload<SyntheticResponseDto>>;
  summaryOrder(
    request: DashboardTimeRequestDto,
  ): Promise<ResponsePayload<SummaryOrderResponseDto>>;
}
