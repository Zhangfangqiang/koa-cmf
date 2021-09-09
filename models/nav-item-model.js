const db            = require("./db-mysql")
const app           = require('../config/app')
const options       = require('../config/model')
const NavModel      = require('./nav-model')
const DataTypes     = require( 'sequelize' )
const CategoryModel = require('./category-model')

module.exports = db.define('nav_item', {
  id: {
    type          : DataTypes.BIGINT.UNSIGNED,
    allowNull     : false,                  //为空
    primaryKey    : true,                   //主键
    autoIncrement : true,                   //自增
  },
  nav_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    comment: '轮播图分组id',
    references: {                           //关联
      model: NavModel,
      key: 'id',
      deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
    }
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
  name:{
    type: DataTypes.STRING(50),
    comment: '导航名称',
  },
  content: {
    type: DataTypes.TEXT,
    comment: '导航描述'
  },
  icon:{
    type: DataTypes.STRING(250),
    comment: 'icon',
  },
  img:{
    type: DataTypes.STRING(250),
    comment: 'icon',
    get() {
      return app.host + this.getDataValue('img')
    }
  },
  href:{
    type: DataTypes.STRING(250),
    comment: '页面跳转',
  },
  category_id:{
    type: DataTypes.BIGINT.UNSIGNED,
    comment: '轮播图分组id',
    references: {                           //关联
      model: CategoryModel,
      key: 'id',
      deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
    }
  },
  option: {
    type: DataTypes.JSON,
    comment: '参数',
  }
},options)