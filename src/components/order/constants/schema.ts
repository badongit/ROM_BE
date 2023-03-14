export const ORDER_SCHEMA = {
  NOTE: {
    LENGTH: 255,
  },
  WAITING_TICKET: {
    LENGTH: 3,
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
