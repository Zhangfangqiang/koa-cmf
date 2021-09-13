const Router               = require("@koa/router")                          //路由
const router               = new Router({prefix: '/api/cart'})               //实例化定义前戳
const common               = require('../../lib/common')                     //常用
const deepmerge            = require('deepmerge');                           //深度合并的方法
const apiMiddleware        = require('./middleware');apiMiddleware(router)
const ContentModel         = require('../../models/content-model')
const ContentSkuModel      = require('../../models/content-sku-model')
const ContentCartModel     = require('../../models/content-cart-model')

/**
 * 创建购物车
 */
router.post("/create", async (ctx) => {
  let res
  let {id: user_id}                                      = ctx.user
  let {content_id, id: content_sku_id, content_sku_desc} = ctx.request.body
  let num                                            = 1

  /*查询购物车是否存在该商品*/
  let hasExistRes = await ContentCartModel.findOne({where: {user_id, content_id, content_sku_id}})

  /*如果存在*/
  if (hasExistRes) {
    res = await ContentCartModel.update({num: hasExistRes.num + 1}, {where: {user_id, content_id, content_sku_id,}})
  } else {
    res = await ContentCartModel.create({user_id, content_id, content_sku_id, content_sku_desc, num})
  }

  ctx.status = 200
  ctx.body   = {code: 200, msg: res ? 'ok' : '', data: res}
})

/**
 * 我的购物车
 */
router.get("/my", async (ctx) => {
  let config         = deepmerge(common.getSqlReady(ctx), {where: {user_id: ctx.user.id}})
      config.include = [{model: ContentModel}, {model: ContentSkuModel}]
  let {count, rows}  = await ContentCartModel.findAndCountAll(config)

  ctx.body = {code: 0, msg: 'ok', data: rows, count}
})

/**
 * 修改我的购物车
 */
router.put("/my/:id", async (ctx) => {
  let id          = Number(ctx.params.id)
  let { num }     = ctx.request.body
  let hasExistRes = await ContentCartModel.findOne({where: {id}})

  if (!hasExistRes) {
    ctx.status      = 200
    ctx.body        = {code: 200, msg: '', data: ''}
  }

  hasExistRes.num = num
  let res    = await hasExistRes.save();
  ctx.status      = 200
  ctx.body        = {code: 200, msg: 'ok', data: res}
})

/**
 * 删除数据
 */
router.delete("/my", async (ctx) => {

  let { ids } = ctx.request.body
  let res     = await ContentCartModel.destroy({where: {id: ids}})      // desctroy返回的不是数据，而是成功删除的数目

  ctx.status = 200
  ctx.body   = {code: 200, msg: res > 0 ? 'ok' : '', data: res}
})


module.exports = router
