const db           = require("./db-mysql")
const options      = require('../config/model')
const DataTypes    = require('sequelize')
const ContentModel = require('./content-model')

module.exports = db.define("content_attr_value",
  {
    id: {
      type         : DataTypes.BIGINT.UNSIGNED,
      allowNull    : false,
      primaryKey   : true,
      autoIncrement: true
    },
    content_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      references: {                           //关联
        model: ContentModel,
        key: 'id',
        deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
      },
      allowNull: false
    },
    attr_key_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    attr_value: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  },options)