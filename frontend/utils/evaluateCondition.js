export const evaluateCondition = (value1, operator, value2) => {
    switch (operator) {
      case '==':
        return value1 == value2;
      case '!=':
        return value1 != value2;
      case '>':
        return value1 > value2;
      case '>=':
        return value1 >= value2;
      case '<':
        return value1 < value2;
      case '<=':
        return value1 <= value2;
      default:
        return false;
    }
}
