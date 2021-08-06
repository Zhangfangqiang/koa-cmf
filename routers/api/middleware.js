const jsonwebtoken  = require('jsonwebtoken')                        //签发验证工具
const koajwt        = require('koa-jwt')                             //给我的感觉就看看head有没有token
const appConfig     = require('../../config/app')
const util          = require('util');
const UserModel     = require('../../models/user-model')

module.exports = (router) => {

  /**
   * jwtSecret 验证排除某些路由
   */
  //router.use(koajwt({secret: appConfig.jwtSecret}).unless({
  //  path: ['/api/user/login']
  //}))

  /**
   * 获取所有请求api路由中的 authorization 并解析为user
   */
  //router.use(async (ctx, next) => {
  //  let authorization = ctx.request.header.authorization;                                         //authorization
  //  if (authorization) {
  //    token       = authorization.split(' ')[1]                                          //删除第一个空格
  //    ctx['user'] = await util.promisify(jsonwebtoken.verify)(token, appConfig.jwtSecret);        //根据token和加密字符串获得数据如果签名不对，这里会报错，走到catch分支
  //  }
  //  await next()    //所有next都要加await，重要！
  //})

  router.use(async (ctx, next) => {
    ctx['user'] = await UserModel.findByPk(1)
    ctx['user'] = ctx['user'].toJSON()
    await next()
  })
}



