'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    token: DataTypes.STRING(50),
    status: DataTypes.STRING(50),
    expire_time: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['token']
      },
      // order: [['id', 'phone']]
    },
    scopes: {
      withToken: {
        attributes: {
          include: ['token']
        }
      }
    }
  });
  return User;
};