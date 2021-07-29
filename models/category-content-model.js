const db            = require("./db-mysql")
const options       = require('../config/model')
const DataTypes     = require('sequelize')
const ContentModel  = require('./content-model')
const CategoryModel = require('./category-model')

/**
 * 定义模型并且抛出,这里的模型不光可以当模型
 * 还可以自动根据模型创建数据库
 * @type {ModelCtor<Model>}
 */
var CategoryContentModel = db.define('category_content',
  /*模型配置*/
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: "内容id",
      references: {                           //关联
        model     : ContentModel,
        key       : 'id',
        deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
      }
    },
    category_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '分类id',
      references: {                           //关联
        model     : CategoryModel,
        key       : 'id',
        deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
      }
    },
    list_order: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: '10000',
      comment: '排序'
    },
    status: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '状态,1:不发布 2:发布;'
    },
  }, options)

module.exports = CategoryContentModel