import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONSTANT } from '@src/constants/common';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { RoleEnum } from '@src/constants/enum/role.enum';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ApiError } from '@src/utils/api-error';
import { ResponseBuilder } from '@src/utils/response-builder';
import { Cache } from 'cache-manager';
import { plainToClass } from 'class-transformer';
import { EmployeeStatusEnum } from '../employee/constants/status.enum';
import { DetailEmployeeResponseDto } from '../employee/dto/response/detail-employee.response.dto';
import { IEmployeeRepository } from '../employee/interfaces/employee.repository.interface';
import { DecodeRefreshTokenDto } from './dto/decode-refresh-token.dto';
import { GetTokenBodyDto } from './dto/request/get-token.body.dto';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { GetTokenResponseDto } from './dto/response/get-token.response.dto';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { IAuthenticationService } from './interfaces/authentication.service.interface';
import { UpdatePasswordBodyDto } from './dto/request/update-password.body.dtp';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    private readonly jwtService: JwtService,

    @Inject('IEmployeeRepository')
    private readonly employeeRepository: IEmployeeRepository, // @Inject(CACHE_MANAGER) // private readonly cacheManager: Cache,
  ) {}

  async login(
    request: LoginRequestDto,
  ): Promise<ResponsePayload<LoginResponseDto | any>> {
    const { phoneNumber, password } = request;
    const user = await this.employeeRepository.findOne({
      where: { phoneNumber: phoneNumber },
      relations: {
        role: true,
      },
    });

    if (!user || !user.validatePassword(password)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.PHONE_NUMBER_OR_PASSWORD_WRONG,
      ).toResponse();
    }

    if (user.status === EmployeeStatusEnum.LEAVE) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.ACCOUNT_DISABLED,
      ).toResponse();
    }

    const accessToken = this._createToken(user.id, user.role.code);
    const refreshToken = this._createRefreshToken(user.id);

    // await this.cacheManager.set(user.id.toString(), refreshToken);
    const userReturn = plainToClass(DetailEmployeeResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      accessToken,
      refreshToken,
      user: userReturn,
    }).build();
  }

  async getToken(
    request: GetTokenBodyDto,
  ): Promise<ResponsePayload<GetTokenResponseDto | any>> {
    const { refreshToken } = request;

    const decoded = this._decodeRefreshToken(refreshToken);

    // const check = await this.cacheManager.get(decoded.id.toString());

    const user = await this.employeeRepository.findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.UNAUTHORIZED,
      ).toResponse();
    }

    const token = this._createToken(user.id, user.role?.code);

    return new ResponseBuilder({ accessToken: token }).build();
  }

  _createToken(id: number, role: RoleEnum): string {
    const expiresIn = JWT_CONSTANT.ACCESS_TOKEN_EXPIRES_IN;
    const secret = JWT_CONSTANT.ACCESS_TOKEN_SECRET;

    const token = this.jwtService.sign({ id, role }, { expiresIn, secret });

    return token;
  }

  _createRefreshToken(id: number): string {
    const expiresIn = JWT_CONSTANT.REFRESH_TOKEN_EXPIRES_IN;
    const secret = JWT_CONSTANT.REFRESH_TOKEN_SECRET;

    const token = this.jwtService.sign({ id }, { expiresIn, secret });

    return token;
  }

  _decodeRefreshToken(token: string): DecodeRefreshTokenDto {
    const secret = JWT_CONSTANT.REFRESH_TOKEN_SECRET;

    return this.jwtService.verify(token, { secret });
  }

  async updatePassword(
    request: UpdatePasswordBodyDto,
  ): Promise<ResponsePayload<LoginResponseDto | any>> {
    const { user, password, newPassword } = request;

    if (!user || !user.validatePassword(password)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.PASSWORD_WRONG,
      ).toResponse();
    }

    user.password = newPassword;
    await this.employeeRepository.save(user);

    return new ResponseBuilder().build();
  }
}
