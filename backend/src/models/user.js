const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database/DBconfig");

class User extends Model {
  static visibilityConditions() {
    return [
      {
        field: 'age',
        watchedField: 'status',
        watchedFieldValue: 'OK',
        operator: `==`
      },
      {
        field: 'salary',
        watchedField: 'active',
        watchedFieldValue: true,
        operator: `==`
      },
    ]
  }
}

User.init( {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: true,
      len: [2, 50],
      isAlpha: true
    }
  },
  lastname: {
    type: DataTypes.STRING(103), //dynamic lookup
    values: 
      {
        model: 'users',
        fieldName: 'email',
      }, 
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(101), //simple lookup
    values: [null, 'OK', 'Pending'],
    allowNull: true,
  },
  age: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: true,
    }
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN, 
    allowNull: true,
  },
  salary: {
    type: DataTypes.DECIMAL, 
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  lookup: {
    type: DataTypes.STRING(103), //dynamic lookup
    values: 
      {
        model: 'users',
        fieldName: 'email',
        watchedField: 'name',
        operator: 'eq'
      }, 
    allowNull: true,
  },
},{
  sequelize, 
  modelName: 'User',
  timestamps: false, 
});

module.exports = User;
