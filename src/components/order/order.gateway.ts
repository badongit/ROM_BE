import { Inject, UseFilters, UsePipes } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SUCCESS_CODE } from '@src/constants/common';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { WsExceptionFilter } from '@src/core/filters/ws-exception.filter';
import { CustomValidationPipe } from '@src/core/pipes/validation.pipe';
import { plainToClass } from 'class-transformer';
import { from, map } from 'rxjs';
import { TableResponseDto } from '../table/dto/response/table.response.dto';
import { ITableRepository } from '../table/interfaces/table.repository.interface';
import { SocketEventEnum } from './constants/event.enum';
import { ChangeStatusOrderDetailRequestDto } from './dto/request/change-status-order-detail.request.dto';
import { CreateOrderRequestDto } from './dto/request/create-order.request.dto';
import { UpdateOrderRequestDto } from './dto/request/update-order.request.dto';
import { DetailOrderResponseDto } from './dto/response/detail-order.response.dto';
import { IOrderRepository } from './interfaces/order.repository.interface';
import { IOrderService } from './interfaces/order.service.interface';
import { CompleteOrderRequestDto } from './dto/request/complete-order.request.dto';
import { MobileScreenEnum } from '@src/constants/enum/mobile-screen.enum';

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

    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,

    @Inject('ITableRepository')
    private readonly tableRepository: ITableRepository,
  ) {}

  @SubscribeMessage(SocketEventEnum.CREATE_ORDER)
  async create(@MessageBody() request: CreateOrderRequestDto): Promise<any> {
    const { tableId } = request;

    const response = await this.orderService.create(request);

    if (SUCCESS_CODE.includes(response.statusCode)) {
      const socketResponse: any[] = [
        {
          event: SocketEventEnum.NOTIFICATION,
          data: { message: MessageEnum.CREATE_SUCCESS },
        },
      ];
      const order = await this.orderRepository.detail(response.data.id);
      const dataReturn = plainToClass(DetailOrderResponseDto, order, {
        excludeExtraneousValues: true,
      });
      socketResponse.push({
        event: SocketEventEnum.SEND_ORDER,
        data: dataReturn,
      });

      if (tableId) {
        const table = await this.tableRepository.findById(tableId);
        const tableReturn = plainToClass(TableResponseDto, table, {
          excludeExtraneousValues: true,
        });
        socketResponse.push({
          event: SocketEventEnum.SEND_TABLE,
          data: tableReturn,
        });
      }
      return from(socketResponse).pipe(map((data) => data));
    } else {
      return { event: SocketEventEnum.ERROR, data: response.message };
    }
  }

  @SubscribeMessage(SocketEventEnum.UPDATE_ORDER)
  async update(@MessageBody() request: UpdateOrderRequestDto): Promise<any> {
    const response = await this.orderService.update(request);

    if (SUCCESS_CODE.includes(response.statusCode)) {
      const socketResponse: any[] = [
        {
          event: SocketEventEnum.NOTIFICATION,
          data: { message: MessageEnum.UPDATE_SUCCESS },
        },
      ];
      const order = await this.orderRepository.detail(response.data.id);
      const dataReturn = plainToClass(DetailOrderResponseDto, order, {
        excludeExtraneousValues: true,
      });
      socketResponse.push({
        event: SocketEventEnum.SEND_ORDER,
        data: dataReturn,
      });

      return from(socketResponse).pipe(map((data) => data));
    } else {
      return { event: SocketEventEnum.ERROR, data: response.message };
    }
  }

  @SubscribeMessage(SocketEventEnum.CONFIRM_ORDER)
  async confirmOrder(@MessageBody() request: IdParamsDto): Promise<any> {
    const response = await this.orderService.confirmOrder(request);

    if (SUCCESS_CODE.includes(response.statusCode)) {
      const socketResponse: any[] = [
        {
          event: SocketEventEnum.NOTIFICATION,
          data: { message: MessageEnum.CONFIRMED },
        },
      ];

      const order = await this.orderRepository.detail(response.data.id);
      const dataReturn = plainToClass(DetailOrderResponseDto, order, {
        excludeExtraneousValues: true,
      });
      socketResponse.push({
        event: SocketEventEnum.SEND_ORDER,
        data: dataReturn,
      });

      if (response.data.tableId) {
        const table = await this.tableRepository.findById(
          response.data.tableId,
        );
        const tableReturn = plainToClass(TableResponseDto, table, {
          excludeExtraneousValues: true,
        });

        socketResponse.push({
          event: SocketEventEnum.SEND_TABLE,
          data: tableReturn,
        });
      }
      return from(socketResponse).pipe(map((data) => data));
    } else {
      return { event: SocketEventEnum.ERROR, data: response.message };
    }
  }

  @SubscribeMessage(SocketEventEnum.CANCEL_ORDER)
  async cancelOrder(@MessageBody() request: IdParamsDto): Promise<any> {
    const response = await this.orderService.cancelOrder(request);

    if (SUCCESS_CODE.includes(response.statusCode)) {
      const socketResponse: any[] = [
        {
          event: SocketEventEnum.NOTIFICATION,
          data: { message: MessageEnum.CANCELED },
        },
      ];

      const order = await this.orderRepository.detail(response.data.id);
      const dataReturn = plainToClass(DetailOrderResponseDto, order, {
        excludeExtraneousValues: true,
      });
      socketResponse.push({
        event: SocketEventEnum.SEND_ORDER,
        data: dataReturn,
      });

      if (response.data.tableId) {
        const table = await this.tableRepository.findById(
          response.data.tableId,
        );
        const tableReturn = plainToClass(TableResponseDto, table, {
          excludeExtraneousValues: true,
        });

        socketResponse.push({
          event: SocketEventEnum.SEND_TABLE,
          data: tableReturn,
        });
      }
      return from(socketResponse).pipe(map((data) => data));
    } else {
      return { event: SocketEventEnum.ERROR, data: response.message };
    }
  }

  @SubscribeMessage(SocketEventEnum.CHANGE_STATUS_ORDER_DETAIL)
  async changeStatusOrderDetail(
    @MessageBody() request: ChangeStatusOrderDetailRequestDto,
  ): Promise<any> {
    const response = await this.orderService.changeStatusOrderDetail(request);
    const messageByStatus = [
      '',
      MessageEnum.CONFIRMED,
      MessageEnum.COMPLETED,
      MessageEnum.CANCELED,
    ];

    if (SUCCESS_CODE.includes(response.statusCode)) {
      const socketResponse: any[] = [
        {
          event: SocketEventEnum.SEND_ORDER_DETAIL,
          data: response.data,
        },
        {
          event: SocketEventEnum.NOTIFICATION,
          data: { message: messageByStatus[request.status] },
        },
      ];

      return from(socketResponse).pipe(map((data) => data));
    } else {
      return { event: SocketEventEnum.ERROR, data: response.message };
    }
  }

  @SubscribeMessage(SocketEventEnum.COMPLETE_ORDER)
  async completeOrder(
    @MessageBody() request: CompleteOrderRequestDto,
  ): Promise<any> {
    const response = await this.orderService.completeOrder(request);

    if (SUCCESS_CODE.includes(response.statusCode)) {
      const socketResponse: any[] = [
        {
          event: SocketEventEnum.NOTIFICATION,
          data: {
            message: MessageEnum.COMPLETED,
            navigate: MobileScreenEnum.PAYMENT_SCREEN,
          },
        },
      ];

      const order = await this.orderRepository.detail(response.data.id);
      const dataReturn = plainToClass(DetailOrderResponseDto, order, {
        excludeExtraneousValues: true,
      });
      socketResponse.push({
        event: SocketEventEnum.SEND_ORDER,
        data: dataReturn,
      });

      if (response.data.tableId) {
        const table = await this.tableRepository.findById(
          response.data.tableId,
        );
        const tableReturn = plainToClass(TableResponseDto, table, {
          excludeExtraneousValues: true,
        });

        socketResponse.push({
          event: SocketEventEnum.SEND_TABLE,
          data: tableReturn,
        });
      }
      return from(socketResponse).pipe(map((data) => data));
    } else {
      return { event: SocketEventEnum.ERROR, data: response.message };
    }
  }

  @SubscribeMessage('send_test')
  async test(@MessageBody() request: any): Promise<any> {
    console.log(request);

    return { event: 'test', data: request };
  }
}
