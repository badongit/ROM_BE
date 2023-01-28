import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { StoreResponseDto } from './dto/store.response.dto';
import { UpdateStoreBodyDto } from './dto/update-store.body.dto';
import { StoreService } from './store.service';

@ApiBearerAuth()
@ApiTags('Stores')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiOperation({ summary: 'Detail' })
  @ApiResponse({ status: ResponseCodeEnum.OK, type: StoreResponseDto })
  detail() {
    return this.storeService.detail();
  }

  @Patch()
  @ApiOperation({ summary: 'Update' })
  @ApiResponse({ status: ResponseCodeEnum.OK })
  update(@Body() body: UpdateStoreBodyDto) {
    return this.storeService.update(body);
  }
}
