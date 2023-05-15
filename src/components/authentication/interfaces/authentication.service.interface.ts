import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { GetTokenBodyDto } from '../dto/request/get-token.body.dto';
import { LoginRequestDto } from '../dto/request/login.request.dto';
import { GetTokenResponseDto } from '../dto/response/get-token.response.dto';
import { LoginResponseDto } from '../dto/response/login.response.dto';
import { UpdatePasswordBodyDto } from '../dto/request/update-password.body.dtp';

export interface IAuthenticationService {
  login(
    request: LoginRequestDto,
  ): Promise<ResponsePayload<LoginResponseDto | any>>;
  getToken(
    request: GetTokenBodyDto,
  ): Promise<ResponsePayload<GetTokenResponseDto | any>>;
  updatePassword(
    request: UpdatePasswordBodyDto,
  ): Promise<ResponsePayload<LoginResponseDto | any>>;
}
