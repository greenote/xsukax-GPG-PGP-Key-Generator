'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserConnection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserConnection.belongsTo(models.User, {as: 'to', foreignKey: 'toId'});
      UserConnection.belongsTo(models.User, {as: 'from', foreignKey: 'fromId'});
      UserConnection.hasMany(models.Category, {as: 'categories', foreignKey: 'userConnectionId'});
      UserConnection.belongsTo(models.User, {as: 'by', foreignKey:'blocked_by'})

    }
  }
  UserConnection.init({
    fromId: DataTypes.INTEGER,
    toId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    blocked_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserConnection',
  });
  return UserConnection;
};