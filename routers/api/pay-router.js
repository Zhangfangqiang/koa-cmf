const Router = require("@koa/router")                          //路由
const router = new Router({prefix: '/api/pay'})                //实例化定义前戳
const common = require('../../lib/common')                     //常用
const apiMiddleware = require('./middleware');apiMiddleware(router)
const short = require('short-uuid');


/**
 * 支付
 */
router.post('/wePay', async ctx => {
  let {id: user_id, open_id} = ctx.user
  let {total_fee, address_id, address_desc, goods_carts_ids, goods_name_desc} = ctx.request.body
  // 为测试方便，所有金额支付数均为1分
  total_fee = 1

  // 依照Order模型接收参数
  var params     = await common.wePay().getBrandWCPayRequestParams({
    body            : goods_name_desc ? goods_name_desc.substr(0, 127) : "fawefawef", //最长127字节
    attach          : '支付测试',                                                      //最长127字节
    out_trade_no    : `${new Date().getFullYear()}${short().new()}`,                 //
    total_fee       : total_fee,                                                     //以分为单位，货币的最小金额
    trade_type      : 'JSAPI',                                                       //NATIVE
    spbill_create_ip: ctx.request.ip,                                                //ctx.request.ip
    openid          : open_id
  });

  if (params && params.package && params.paySign) {
    res = await Order.create({user_id, out_tradeNo, pay_state, total_fee, address_id, address_desc, goods_carts_ids, goods_name_desc})
  } else {
    console.log('error! return null!');
  }

  ctx.status = 200
  ctx.body = {code: 0, msg: 'ok', data: {res, params}}
})


module.exports = router