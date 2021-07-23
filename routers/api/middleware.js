const jsonwebtoken  = require('jsonwebtoken')                        //签发验证工具
const koajwt        = require('koa-jwt')                             //给我的感觉就看看head有没有token
const appConfig     = require('../../config/app')


module.exports = (router) => {
  router.use(koajwt({secret: appConfig.jwtSecret}).unless({
    path: ['/api/user/login']
  }))
}