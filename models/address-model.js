const db         = require("./db-mysql")
const options    = require('../config/model')
const DataTypes  = require('sequelize')
const UserModel  = require('./user-model')

/**
 * 地址模型
 * @type {ModelCtor<Model>}
 */
var AddressModel = db.define("address", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull    : false,
    primaryKey   : true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    references: {
      model     : UserModel,
      key       : 'id',
      deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
    },
    allowNull : false
  },
  user_name: {
    type      : DataTypes.STRING(200),
    allowNull : false
  },
  tel_number: {
    type      : DataTypes.STRING(200),
    allowNull : false
  },
  region: {
    type      : DataTypes.JSON,
    allowNull : false
  },
  detail_info: {
    type      : DataTypes.STRING(500),
    allowNull : false
  }
}, {
  ...options
})

module.exports = AddressModel