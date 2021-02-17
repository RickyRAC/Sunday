'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.item.belongsTo(models.list)
    }
  };
  item.init({
    listId: DataTypes.INTEGER,
    item: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'item',
  });
  return item;
};