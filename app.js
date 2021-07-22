const Koa             = require('koa')                         //引入koa
const middleware      = require("./middleware")                //引入中间建
const routers         = require("./routers")                   //引入路由
const dbInit          = require("./models/db-init")            //初始化数据库
const app             = new Koa()                              //构建koa

middleware(app)
routers(app)
dbInit()

app.listen(3000)      //设置端口