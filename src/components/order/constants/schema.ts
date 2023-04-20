export const ORDER_SCHEMA = {
  NOTE: {
    LENGTH: 255,
  },
  WAITING_TICKET: {
    LENGTH: 3,
  },
  PAYMENT_REALITY: {
    MIN: 0,
  },
  POINT_USED: {
    MIN: 0,
  },
};

export const ORDER_DETAIL_SCHEMA = {
  QUANTITY: {
    MIN: 1,
  },
  PRICE: {
    MIN: 1000,
  },
  NOTE: {
    LENGTH: 127,
  },
};
