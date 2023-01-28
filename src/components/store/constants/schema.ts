const STORE_SCHEMA = {
  NAME: {
    LENGTH: 127,
  },
  PHONE_NUMBER: {
    LENGTH: 10,
    REGEX: /^[0]\d+$/,
  },
  ADDRESS: {
    LENGTH: 255,
  },
  DESCRIPTION: {
    LENGTH: 255,
  },
};

export default STORE_SCHEMA;
