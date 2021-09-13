const db           = require("./db-mysql")
const options      = require('../config/model')
const DataTypes    = require('sequelize')
const ContentModel = require('./content-model')

var ContentSku = db.define("content_sku",
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
        model     : ContentModel,
        key       : 'id',
        deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
      },
      allowNull: false
    },
    content_attr_path: {//[1,2]
      type: DataTypes.JSON,
      allowNull: false
    },
    content_sku_desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {  //微信支付用分
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    stock: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, options)


module.exports = ContentSku