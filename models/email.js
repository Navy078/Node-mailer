'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Email extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Email.init({
    userEmail: DataTypes.STRING,
    emailType: DataTypes.STRING,
    emailData: DataTypes.JSONB,
    emailStatus: DataTypes.STRING,
    emailUrl: {
      type: DataTypes.STRING,
      allowNull:true
    }
  }, {
    sequelize,
    tableName: 'emails',
    modelName: 'Email',
  });
  return Email;
};