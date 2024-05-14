export const getValidationRules = (field) => {
    const rules = {};
  
    if (!field.allowNull) {
      rules.required = "This field is required";
    }
  
    if (field.validate) {
      if (field.validate.notEmpty) {
        rules.required = "This field must not be empty";
      }
  
      if (field.validate.len) {
        const [min, max] = field.validate.len;
        rules.minLength = {
          value: min,
          message: `Minimum length is ${min}`,
        };
        rules.maxLength = {
          value: max,
          message: `Maximum length is ${max}`,
        };
      }
  
      if (field.validate.isEmail) {
        rules.pattern = {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email format",
        };
      }
  
      if (field.validate.isUrl) {
        rules.pattern = {
          value: /^(https?:\/\/[^\s/$.?#].[^\s]*)$/,
          message: "Invalid URL format",
        };
      }
  
      if (field.validate.isIP) {
        rules.pattern = {
          value: /^(?:\d{1,3}\.){3}\d{1,3}$|^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/,
          message: "Invalid IP address format",
        };
      }
  
      if (field.validate.isIPv4) {
        rules.pattern = {
          value: /^(?:\d{1,3}\.){3}\d{1,3}$/,
          message: "Invalid IPv4 address format",
        };
      }
  
      if (field.validate.isIPv6) {
        rules.pattern = {
          value: /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/,
          message: "Invalid IPv6 address format",
        };
      }
  
      if (field.validate.isAlpha) {
        rules.pattern = {
          value: /^[a-zA-Z]+$/,
          message: "Only letters are allowed",
        };
      }
  
      if (field.validate.isAlphanumeric) {
        rules.pattern = {
          value: /^[a-zA-Z0-9]+$/,
          message: "Only alphanumeric characters are allowed",
        };
      }
  
      if (field.validate.isNumeric) {
        rules.pattern = {
          value: /^\d+$/,
          message: "Only numbers are allowed",
        };
      }
  
      if (field.validate.isInt) {
        rules.pattern = {
          value: /^-?\d+$/,
          message: "Only integer numbers are allowed",
        };
      }
  
      if (field.validate.isFloat) {
        rules.pattern = {
          value: /^-?\d+(\.\d+)?$/,
          message: "Only valid floating-point numbers are allowed",
        };
      }
  
      if (field.validate.isLowercase) {
        rules.pattern = {
          value: /^[a-z]+$/,
          message: "Only lowercase letters are allowed",
        };
      }
  
      if (field.validate.isUppercase) {
        rules.pattern = {
          value: /^[A-Z]+$/,
          message: "Only uppercase letters are allowed",
        };
      }
  
      if (field.validate.isDate) {
        rules.pattern = {
          value: /^\d{4}-\d{2}-\d{2}$/,
          message: "Invalid date format (YYYY-MM-DD)",
        };
      }
  
      if (field.validate.isUUID) {
        rules.pattern = {
          value: /^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/i,
          message: "Invalid UUID format",
        };
      }
  
      if (field.validate.isCreditCard) {
        rules.pattern = {
          value: /^(\d{4}-){3}\d{4}|\d{16}$/,
          message: "Invalid credit card format",
        };
      }
  
      if (field.validate.equals) {
        rules.equals = {
          value: field.validate.equals,
          message: `Value must be '${field.validate.equals}'`,
        };
      }
  
      if (field.validate.contains) {
        rules.contains = {
          value: new RegExp(field.validate.contains, 'i'),
          message: `Must contain '${field.validate.contains}'`,
        };
      }
  
      if (field.validate.notIn) {
        rules.notIn = {
          value: field.validate.notIn[0],
          message: `Value must not be one of [${field.validate.notIn[0].join(', ')}]`,
        };
      }
  
      if (field.validate.isIn) {
        rules.isIn = {
          value: field.validate.isIn[0],
          message: `Value must be one of [${field.validate.isIn[0].join(', ')}]`,
        };
      }
  
      if (field.validate.notContains) {
        rules.notContains = {
          value: new RegExp(field.validate.notContains, 'i'),
          message: `Must not contain '${field.validate.notContains}'`,
        };
      }
    }
  
    return rules;
  };