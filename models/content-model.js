const db                   = require("./db-mysql")
const options              = require('../config/model')
const DataTypes            = require('sequelize')
const UserModel            = require('./user-model')



/**
 * 定义模型并且抛出,这里的模型不光可以当模型
 * 还可以自动根据模型创建数据库
 * @type {ModelCtor<Model>}
 */

var ContentModel = db.define('content',
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
      comment: '父id'
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
    list_order:{
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: '10000',
      allowNull: false,
      comment: '排序'
    },
    type: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '1文章 , 2页面'
    },
    is_top: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '是否置顶 1不置顶 2置顶'
    },
    is_recommended: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '是否推荐 1不推荐 2推荐'
    },
    status: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '状态 1未发布 , 2发布'
    },
    comment_status: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '状态 1不允许评论  2 允许评论',
    },
    format: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '内容格式;1:html; 2:md'
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '用户id',
      references: {                           //关联
        model     : UserModel,
        key       : 'id',
        deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
      }
    },
    hits_count: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '点击数'
    },
    favorites_count: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '收藏数'
    },
    like_count: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '点赞数'
    },
    comment_count: {
      type: DataTypes.BIGINT.UNSIGNED,
      comment: '品论数'
    },
    title: {
      type: DataTypes.STRING,
      comment: '标题'
    },
    keywords: {
      type: DataTypes.STRING,
      comment: '关键词'
    },
    excerpt: {
      type: DataTypes.TEXT,
      comment: '摘要'
    },
    source: {
      type: DataTypes.STRING,
      comment: '数据来源 原创 其他网站自己填写'
    },
    thumbnail: {
      type: DataTypes.STRING,
      comment: '缩略图'
    },
    content: {
      type: DataTypes.TEXT,
      comment: '内容'
    },
    content_filtered: {
      type: DataTypes.TEXT,
      comment: '过滤后的内容'
    },
    more: {
      type: DataTypes.JSON,
      comment: '扩展属性'
    },
    published_at: {
      type: DataTypes.DATE,
      comment: '发布时间'
    },
    delete_at: {
      type: DataTypes.DATE,
      comment: '删除时间'
    },
  }, options)

module.exports = ContentModel