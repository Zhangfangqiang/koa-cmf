const db        = require("./db-mysql")
const options   = require('../config/model')
const SlideModel= require('./slide-model')
const DataTypes = require('sequelize')


/**
 * 定义模型并且抛出,这里的模型不光可以当模型
 * 还可以自动根据模型创建数据库
 * @type {ModelCtor<Model>}
 */
var SlideItemModel = db.define('slide_item',
  /*模型配置*/
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    slide_id:{
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '轮播图分组id',
      references: {                           //关联
        model: SlideModel,
        key: 'id',
        deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
      }
    },
    status: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: 1,
      comment: '状态 1未发布 , 2发布'
    },
    list_order: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: '10000',
      allowNull: false,
      comment: '排序'
    },
    title: {
      type: DataTypes.STRING,
      comment: '标题'
    },
    path: {
      type: DataTypes.STRING,
      comment: '图片路径'
    },
    url: {
      type: DataTypes.STRING,
      comment: '点击图片后打开的url'
    },
    target: {
      type: DataTypes.STRING,
      comment: '点击后的打开方式'
    },
    content: {
      type: DataTypes.TEXT,
      comment: '描述'
    },
    more: {
      type: DataTypes.JSON,
      comment: '扩展属性'
    }
  }, options)

module.exports = SlideItemModel