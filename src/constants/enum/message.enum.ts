export enum MessageEnum {
  // common
  SUCCESS = 'Thành công',
  BAD_REQUEST = 'Bad request',
  UNAUTHORIZED = 'Không có quyền truy cập',
  PHONE_NUMBER_OR_PASSWORD_WRONG = 'Số điện thoại hoặc mật khẩu không đúng',
  FILE_SIZE_EXCEEDED_ALLOW = 'Kích thước file quá lớn',
  FILE_TYPE_NOT_ALLOW = 'Loại file không hợp lệ',

  // not found
  FLOOR_NOT_FOUND = 'Dữ liệu Tầng không tồn tại',
  TABLE_NOT_FOUND = 'Dữ liệu Bàn không tồn tại',
  CATEGORY_NOT_FOUND = 'Dữ liệu Danh mục không tồn tại',
  DISH_NOT_FOUND = 'Dữ liệu món ăn không tồn tại',
  CUSTOMER_NOT_FOUND = 'Dữ liệu Khách hàng không tồn tại',
  EMPLOYEE_NOT_FOUND = 'Dữ liệu Nhân viên không tồn tại',

  // existed
  CODE_EXISTED = 'Mã đã tồn tại',
  NAME_EXISTED = 'Tên đã tồn tại',
  PHONE_NUMBER_EXISTED = 'Số điện thoại đã tồn tại',

  // invalid
  STATUS_INVALID = 'Trạng thái không hợp lệ',
}
