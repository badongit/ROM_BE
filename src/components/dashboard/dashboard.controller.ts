import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IDashboardService } from './interfaces/dashboard.service.interface';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { SyntheticResponseDto } from './dto/synthetic.response.dto';
import { SummaryOrderResponseDto } from './dto/summary-order.response.dto';

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
  @ApiResponse({ status: ResponseCodeEnum.OK, type: SummaryOrderResponseDto })
  summaryOrder(@Query() query) {
    return this.dashboardService.summaryOrder(query);
  }
}
