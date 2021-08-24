const DataTypes = require( 'sequelize' )
const db        = require("./db-mysql")
const UserModel = require("./user-model")
const options   = require('../config/model')


module.exports = db.define('session_key', {
  id: {
    type          : DataTypes.BIGINT.UNSIGNED,
    allowNull     : false,                  //为空
    primaryKey    : true,                   //主键
    autoIncrement : true,                   //自增
  },
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    references: {                           //关联
      model     : UserModel,
      key       : 'id',
      deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
    },
    allowNull: false
  },
  sessionKey: {
    type      : DataTypes.STRING(24),
    allowNull : false
  }
},options)