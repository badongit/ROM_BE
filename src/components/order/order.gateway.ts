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
import { SocketEventEnum } from './constants/event.enum';
import { CreateOrderRequestDto } from './dto/request/create-order.request.dto';
import { IOrderService } from './interfaces/order.service.interface';
import { ITableRepository } from '../table/interfaces/table.repository.interface';
import { plainToClass } from 'class-transformer';
import { TableResponseDto } from '../table/dto/response/table.response.dto';
import { from, map } from 'rxjs';
import { UpdateOrderRequestDto } from './dto/request/update-order.request.dto';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';

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

    @Inject('ITableRepository')
    private readonly tableRepository: ITableRepository,
  ) {}

  @SubscribeMessage(SocketEventEnum.CREATE_ORDER)
  async create(@MessageBody() request: CreateOrderRequestDto): Promise<any> {
    const { tableId } = request;

    const response = await this.orderService.create(request);

    if (SUCCESS_CODE.includes(response.statusCode)) {
      const socketResponse: any[] = [
        { event: SocketEventEnum.SEND_ORDER, data: response.data },
        {
          event: SocketEventEnum.NOTIFICATION,
          data: { message: 'Tạo thành công' },
        },
      ];

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
        { event: SocketEventEnum.SEND_ORDER, data: response.data },
        {
          event: SocketEventEnum.NOTIFICATION,
          data: { message: 'Cập nhật thành công' },
        },
      ];
      return from(socketResponse).pipe(map((data) => data));
    } else {
      return { event: SocketEventEnum.ERROR, data: response.message };
    }
  }

  @SubscribeMessage(SocketEventEnum.CONFIRM_ORDER)
  async confirm(@MessageBody() request: IdParamsDto): Promise<any> {
    const response = await this.orderService.confirmOrder(request);

    if (SUCCESS_CODE.includes(response.statusCode)) {
      const socketResponse: any[] = [
        { event: SocketEventEnum.SEND_ORDER, data: response.data },
        {
          event: SocketEventEnum.NOTIFICATION,
          data: { message: 'Xác nhận thành công' },
        },
      ];

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
  async cancel(@MessageBody() request: IdParamsDto): Promise<any> {
    const response = await this.orderService.cancelOrder(request);

    if (SUCCESS_CODE.includes(response.statusCode)) {
      const socketResponse: any[] = [
        { event: SocketEventEnum.SEND_ORDER, data: response.data },
        {
          event: SocketEventEnum.NOTIFICATION,
          data: { message: 'Hủy thành công' },
        },
      ];

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
