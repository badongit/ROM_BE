import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { LoginRequestDto } from '../dto/request/login.request.dto';
import { LoginResponseDto } from '../dto/response/login.response.dto';

export interface IAuthenticationService {
  validateToken(): Promise<ResponsePayload<any>>;
  login(
    request: LoginRequestDto,
  ): Promise<ResponsePayload<LoginResponseDto | any>>;
}
