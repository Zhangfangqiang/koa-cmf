const Router        = require("@koa/router")                          //路由
const router        = new Router({prefix: '/api/address'})            //实例化定义前戳
const common        = require('../../lib/common')                     //常用
const apiMiddleware = require('./middleware');apiMiddleware(router)
const AddressModel  = require('../../models/address-model')

/**
 * 数据列表
 */
router.get("/index", async (ctx) => {
  let addressList = await AddressModel.findAll({where: {"user_id": ctx.user.id}})

  ctx.status = 200
  ctx.body   = {code: 200, msg: 'ok', data: addressList}
})

/**
 * 创建
 */
router.post("/index", async (ctx) => {
  let res
  let {userName: user_name, telNumber: tel_number, region, detailInfo: detail_info} = ctx.request.body
  let hasExistRes = await AddressModel.findOne({where: {tel_number: tel_number, user_id: ctx.user.id}})   //有可能是帮别人买东西

  if (!hasExistRes) {
    res = await AddressModel.create({user_id: ctx.user.id, user_name, tel_number, region, detail_info})
  }

  ctx.status = 200
  ctx.body   = {code: 200, msg: res ? 'ok' : '', data: res}
})

module.exports = router
