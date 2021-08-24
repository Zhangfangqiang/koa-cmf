const Router         = require("@koa/router")                          //路由
const router         = new Router({prefix: '/api/nav'})              //实例化定义前戳
const common         = require('../../lib/common')                     //常用
const apiMiddleware  = require('./middleware');apiMiddleware(router)
const NavModel       = require('../../models/nav-model')             //轮播图模型
const NavItemModel   = require('../../models/nav-item-model')        //轮播图模型item

/**
 * 返回数据列表
 */
router.get('/index', async (ctx, next) => {
  var {count, rows} = await NavModel.findAndCountAll(common.getSqlReady(ctx))
  ctx.body = {code: 0, msg: 'ok', data: rows, count}
})

/**
 * 创建数据
 */
router.post('/create', async (ctx, next) => {
  let {name, content} = ctx.request.body

  await NavModel.create({name, content}).then((s) => {
    ctx.body = {code: 0, msg: '成功'}
  }).catch((e) => {
    ctx.body = {code: 400, msg: e.message}
  })
})

/**
 * 获取一条数据
 */
router.get('/:id', async (ctx, next) => {
  let {id}   = ctx.params
  let config = common.getSqlReady(ctx)

  await NavModel.findByPk(id, config).then((user) => {
    ctx.body = {code: 0, msg: 'ok', data: user}
  })
})

/**
 * 更新数据
 */
router.put('/:id', async (ctx, next) => {
  let {id}          = ctx.params
  let {value,field} = ctx.request.body

  if (field == 'is_main') {
    await NavModel.update(JSON.parse(`{"${field}":"2"}`),{where: {is_main: 1}})
  }

  await NavModel.update(JSON.parse(`{"${field}":"${value}"}`),{where: {id: id}})
  ctx.body = {code: 0, msg: '成功'}
})

/**
 * 删除数据
 */
router.delete('/destroy', async (ctx, next) => {
  let config      = common.bodySqlReady(ctx)
  let configNav = common.bodySqlReady({request:{body: {where: {nav_id: ctx.request.body.where.id}}}})

  try {
    await NavItemModel.destroy(configNav)
    await NavModel.destroy(config)
  }catch (e){
    ctx.body = {code: 400, msg: e.message}
  }

  ctx.body = {code: 0, msg: '删除成功'}
})

module.exports = router