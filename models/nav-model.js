const DataTypes = require( 'sequelize' )
const db        = require("./db-mysql")
const options   = require('../config/model')


module.exports = db.define('nav', {
  id: {
    type          : DataTypes.BIGINT.UNSIGNED,
    allowNull     : false,                  //为空
    primaryKey    : true,                   //主键
    autoIncrement : true,                   //自增
  },
  is_main: {
    type          : DataTypes.BIGINT.UNSIGNED,
    defaultValue  : '2',
    comment       : '1 不是主要 , 2 是主要'
  },
  name:{
    type: DataTypes.STRING(50),
    comment: '导航名称',
  },
  content: {
    type: DataTypes.TEXT,
    comment: '导航描述'
  },
},options)