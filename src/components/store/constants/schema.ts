const STORE_SCHEMA = {
  NAME: {
    LENGTH: 127,
  },
  PHONE_NUMBER: {
    REGEX: /^[0]\d{9}$/,
  },
  ADDRESS: {
    LENGTH: 255,
  },
  DESCRIPTION: {
    LENGTH: 255,
  },
};

export default STORE_SCHEMA;
