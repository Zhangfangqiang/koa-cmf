const db           = require("./db-mysql")
const options      = require('../config/model')
const DataTypes    = require('sequelize')
const ContentModel = require('./content-model')

// 颜色、尺码
module.exports = db.define("content_attr_key",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull    : false,
      primaryKey   : true,
      autoIncrement: true
    },
    content_id: {
      type     : DataTypes.BIGINT.UNSIGNED,
      references: {                           //关联
        model: ContentModel,
        key: 'id',
        deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
      },
      allowNull: false
    },
    attr_key: {
      type     : DataTypes.STRING(50),
      allowNull: false
    }
  }, options);