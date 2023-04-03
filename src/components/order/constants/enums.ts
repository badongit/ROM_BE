export enum OrderStatusEnum {
  WAIT_CONFIRM = 0, // chờ xác nhận
  IN_PROGRESS = 1, // đang thực hiện
  COMPLETED = 2, // hoàn thành
  CANCEL = 3, // đã hủy
}

export enum OrderDetailStatusEnum {
  WAIT_CONFIRM = 0, // chờ xác nhận
  IN_PROGRESS = 1, // đang thực hiện
  COMPLETED = 2, // hoàn thành
  CANCEL = 3, // đã hủy
}

export enum OrderTypeEnum {
  IN_HERE = 0, // tại chỗ
  BRING_BACK = 1, // mang đi
}

export enum PaymentMethodEnum {
  CASH = 0, // tiền mặt
  BANK_TRANSFER = 1, // chuyển khoản
}
