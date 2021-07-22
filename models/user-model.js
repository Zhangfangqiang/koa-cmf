const db = require("./db-mysql")
const options = require('../config/model')
const DataTypes = require('sequelize')

/**
 * 定义模型并且抛出,这里的模型不光可以当模型
 * 还可以自动根据模型创建数据库
 * @type {ModelCtor<Model>}
 */
module.exports = db.define('user',
  /*模型配置*/
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: ''
    },
    type: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: '2',
      comment: '1 admin 管理员 , 2 普通用户'
    },
    status: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: '3',
      comment: '1封号禁用 , 2正常 , 3未验证如邮箱验证手机号验证'
    },
    open_id: {
      type: DataTypes.STRING(32),
      unique: true,
      comment: '微信open_ID'
    },
    login_name: {
      type: DataTypes.STRING(50),
      unique: true,
      comment: '用户昵称',
    },
    nick_name: {
      type: DataTypes.STRING(50),
      comment: '用户昵称',
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      comment: '用户邮箱',
      validate: {
        isEmail: {msg: "邮箱验证错误"},
      }
    },
    phone: {
      type: DataTypes.STRING(30),
      unique: true,
      comment: '用户手机号'
    },
    password: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '用户密码'
    },
    avatar_url: {
      type: DataTypes.STRING,
      comment: '用户头像'
    },
    sex: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: '3',
      comment: '性别 1男2女 3未知'
    },
    country: {
      type: DataTypes.STRING(100),
      comment: '国家'
    },
    province: {
      type: DataTypes.STRING(100),
      comment: '省份'
    },
    city: {
      type: DataTypes.STRING(100),
      comment: '城市'
    },
    last_login_ip: {
      type: DataTypes.STRING(100),
      comment: '最后登陆ip'
    },
    last_login_at: {
      type: DataTypes.DATE,
      comment: '最后登陆时间'
    }
  }, options)