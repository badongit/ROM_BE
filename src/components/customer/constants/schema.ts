const CUSTOMER_SCHEMA = {
  NAME: {
    LENGTH: 63,
  },
  PHONE_NUMBER: {
    LENGTH: 10,
    REGEX: /^[0]\d+$/,
  },
  POINT: {
    MIN: 0,
  },
};

export default CUSTOMER_SCHEMA;
