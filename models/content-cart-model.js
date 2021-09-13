const db              = require("./db-mysql")
const options         = require('../config/model')
const UserModel       = require('./user-model')
const DataTypes       = require('sequelize')
const ContentModel    = require('./content-model')
const ContentSkuModel = require('./content-sku-model')

module.exports = db.define("content_cart", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    references: {                           //关联
      model: UserModel,
      key: 'id',
      deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
    },
    allowNull: false
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

  content_sku_desc: {
    type: DataTypes.TEXT('tiny'),
    allowNull: false
  },
  content_sku_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    references: {                           //关联
      model: ContentSkuModel,
      key: 'id',
      deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
    },
    allowNull: false
  },
  num: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  }
}, options)