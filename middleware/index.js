const logger          = require('koa-logger')                  //引入koa日志打印工具
const session         = require('koa-session')                 //实现session功能的模块
const koaBody         = require('koa-body')                    //request.body数据
const sessionConfig   = require('../config/session')           //session配置
const viewConfig      = require('../config/view')              //视图配置
const render          = require('koa-art-template');           //一个视图模板
const koaStaticServer = require('koa-static-server')           //koa 静态资源
const qs              = require('qs')

module.exports = app  => {
  app.keys = ['some secret hurr']                           //设置签名的 Cookie 密钥
  app.use(logger())                                         //路由日志打印
  app.use(koaBody({                                         //post提交的数据
    multipart : true,
    strict    : false,                                      //默认true，设为false,delete、get、patch
  }));
  app.use(session(sessionConfig, app))                      //设置session
  app.use(koaStaticServer(viewConfig.static))               //静态资源配置
  app.use(async (ctx, next) => {
    ctx.qs = {}
    try {
      if (ctx.querystring) {
        ctx.qs = await qs.parse(ctx.querystring)
      }
    } catch (e) {
      console.log('ctx.querystring 为空')
    }
    await next();
  });                      //qs 配置
  render(app, viewConfig)                                   //返回视图方法配置
}