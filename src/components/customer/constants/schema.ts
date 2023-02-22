const CUSTOMER_SCHEMA = {
  NAME: {
    LENGTH: 63,
  },
  PHONE_NUMBER: {
    REGEX: /^[0]\d{9}$/,
  },
  POINT: {
    MIN: 0,
  },
};

export default CUSTOMER_SCHEMA;
