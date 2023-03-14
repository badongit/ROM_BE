const EMPLOYEE_SCHEMA = {
  NAME: {
    LENGTH: 63,
  },
  CODE: {
    LENGTH: 5,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 30,
  },
  SALARY: {
    MIN: 1000,
  },
};

export default EMPLOYEE_SCHEMA;
