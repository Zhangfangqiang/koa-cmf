const db                   = require("./db-mysql")
const options              = require('../config/model')
const DataTypes            = require('sequelize')

/**
 * 定义模型并且抛出,这里的模型不光可以当模型
 * 还可以自动根据模型创建数据库
 * @type {ModelCtor<Model>}
 */

var CategoryModel = db.define('category',
  /*模型配置*/
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    parent_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: "父id"
    },
    path: {
      type: DataTypes.STRING,
      comment: '无线分类层级路径',
    },
    level:{
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue:0,
      comment: '层级'
    },
    content_count: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: "该分类文章总数"
    },
    status: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: 1,
      allowNull: false,
      comment: '1未发布 , 2发布'
    },
    list_order: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: '10000',
      allowNull: false,
      comment: '排序'
    },
    name: {
      type: DataTypes.STRING,
      comment: '分类名称',
    },
    description: {
      type: DataTypes.TEXT,
      comment: '分类描述'
    },
    seo_title: {
      type: DataTypes.STRING,
      comment: 'seo 优化标题'
    },
    seo_keywords: {
      type: DataTypes.STRING,
      comment: 'seo 优化关键词'
    },
    seo_description: {
      type: DataTypes.TEXT,
      comment: 'seo 优化描述'
    },
    list_tpl: {
      type: DataTypes.STRING,
      comment: '列表模板'
    },
    details_tpl: {
      type: DataTypes.STRING,
      comment: '详情模板'
    },
    more: {
      type: DataTypes.JSON,
      comment: '扩展数据'
    },
    delete_at: {
      type: DataTypes.DATE,
      comment: '删除时间'
    }
  }, options)

module.exports = CategoryModel