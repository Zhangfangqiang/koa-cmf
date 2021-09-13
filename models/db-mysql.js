const {Sequelize}    = require('sequelize');
const dbAssociations = require('./db-associations')

const db = new Sequelize({
  host    : '127.0.0.1',            //主机名
  port    : 3306,                   //端口号，MySQL默认3306
  database: 'koacmf_zfajax_co',     //数据库名
  username: 'koacmf_zfajax_co',     //用户名
  password: 'SCe2ex6LdZZkx4wr',     //密码
  timezone: "+08:00",
  define: {
    charset : 'utf8mb4',
    dialectOptions: {
      collate: 'utf8mb4_general_ci'
    },
    underscored     : true,         //下划线
    freezeTableName : true,         //是否冻结表名, 默认表名会转换为复数形式
    timestamps      : true,         //createdAt 记录表的创建时间 updatedAt 记录字段更新时间
    paranoid        : false         //是否为表添加 deletedAt 字段 destroy() 方法会删除数据，设置 paranoid 为 true 时，将会更新 deletedAt 字段，并不会真实删除数据。
  },
  dialect: "mysql"
});

db.authenticate().then(() => {
  console.log('数据库连接成功')
  dbAssociations()          //第一次数据库要注释这行
}).catch(err => {
  console.error('数据库连接异常', err)
})

module.exports = db