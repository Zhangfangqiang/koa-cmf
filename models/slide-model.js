const db        = require("./db-mysql")
const options   = require('../config/model')
const DataTypes = require('sequelize')


/**
 * 定义模型并且抛出,这里的模型不光可以当模型
 * 还可以自动根据模型创建数据库
 * @type {ModelCtor<Model>}
 */
var SlideModel = db.define('slide',
  /*模型配置*/
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: 1,
      comment: '状态 1未发布 , 2发布'
    },
    name: {
      type: DataTypes.STRING,
      comment: '标题'
    },
    remark: {
      type: DataTypes.TEXT,
      comment: '描述'
    },
    delete_at: {
      type: DataTypes.DATE,
      comment: '删除时间'
    }
  }, options)

module.exports = SlideModel