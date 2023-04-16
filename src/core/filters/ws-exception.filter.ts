import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets/exceptions';
import { SocketEventEnum } from '@src/components/order/constants/event.enum';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const [socket] = host.getArgs();

    if (exception) {
      socket.emit(
        SocketEventEnum.ERROR,
        exception.error || exception.message || exception,
      );
    }
  }
}
