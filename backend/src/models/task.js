const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database/DBconfig");

class Task extends Model {
  static visibilityConditions() {
    return [
      {}
    ]
  }
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Task",
  }
);

module.exports = Task;
