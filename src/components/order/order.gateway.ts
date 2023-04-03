import { UseFilters, UsePipes } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SUCCESS_CODE } from '@src/constants/common';
import { WsExceptionFilter } from '@src/core/filters/ws-exception.filter';
import { CustomValidationPipe } from '@src/core/pipes/validation.pipe';
import { OrderEventEnum } from './constants/event.enum';
import { CreateOrderRequestDto } from './dto/request/create-order.request.dto';
import { OrderService } from './order.service';

@WebSocketGateway()
@UseFilters(new WsExceptionFilter())
@UsePipes(new CustomValidationPipe())
export class OrderGateway {
  constructor(private readonly orderService: OrderService) {}

  @SubscribeMessage(OrderEventEnum.CREATE)
  async create(@MessageBody() request: CreateOrderRequestDto): Promise<any> {
    const response = await this.orderService.create(request);

    if (SUCCESS_CODE.includes(response.statusCode)) {
      return { event: OrderEventEnum.SEND_ORDER, data: response.data };
    } else {
      return { event: OrderEventEnum.ERROR, data: response.message };
    }
  }
}
