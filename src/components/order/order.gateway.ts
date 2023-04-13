import { Inject, UseFilters, UsePipes } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SUCCESS_CODE } from '@src/constants/common';
import { WsExceptionFilter } from '@src/core/filters/ws-exception.filter';
import { CustomValidationPipe } from '@src/core/pipes/validation.pipe';
import { OrderEventEnum } from './constants/event.enum';
import { CreateOrderRequestDto } from './dto/request/create-order.request.dto';
import { IOrderService } from './interfaces/order.service.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(new WsExceptionFilter())
@UsePipes(new CustomValidationPipe())
export class OrderGateway {
  constructor(
    @Inject('IOrderService')
    private readonly orderService: IOrderService,
  ) {}

  @SubscribeMessage(OrderEventEnum.CREATE)
  async create(@MessageBody() request: CreateOrderRequestDto): Promise<any> {
    const response = await this.orderService.create(request);

    if (SUCCESS_CODE.includes(response.statusCode)) {
      return { event: OrderEventEnum.SEND_ORDER, data: response.data };
    } else {
      return { event: OrderEventEnum.ERROR, data: response.message };
    }
  }

  @SubscribeMessage('send_test')
  async test(@MessageBody() request: any): Promise<any> {
    console.log(request);

    return { event: 'test', data: request };
  }
}
