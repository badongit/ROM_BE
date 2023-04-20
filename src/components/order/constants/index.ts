import { RoleEnum } from '@src/constants/enum/role.enum';

export const PREFIX_ORDER_CODE = 'HD';
export const EXCHANGE_RATE = 1000;
export const DISCOUNT_PERCENT = 5;
export const ROLE_ALLOW_COMPLETED_ORDER = [
  RoleEnum.CASHIER,
  RoleEnum.MANAGER,
  RoleEnum.ADMIN,
];
