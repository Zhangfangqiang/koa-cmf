const Router         = require("@koa/router")                          //路由
const router         = new Router({prefix: '/api/slide'})              //实例化定义前戳
const common         = require('../../lib/common')                     //常用
const apiMiddleware  = require('./middleware');apiMiddleware(router)
const SlideModel     = require('../../models/slide-model')             //轮播图模型
const SlideItemModel = require('../../models/slide-item-model')        //轮播图模型item

/**
 * 返回数据列表 正在使用
 */
router.get('/index', async (ctx, next) => {
  var {count, rows} = await SlideModel.findAndCountAll(common.getSqlReady(ctx))
           ctx.body = {code: 0, msg: 'ok', data: rows, count}
})

/**
 * 创建轮播图的方法
 */
router.post('/create', async (ctx, next) => {
  let {name, remark} = ctx.request.body
  let status         = ctx.request.body.status ? ctx.request.body.status : 1

  await SlideModel.create({name, remark, status}).then((s) => {
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

  await SlideModel.findByPk(id, config).then((user) => {
    ctx.body = {code: 0, msg: 'ok', data: user}
  })
})

/**
 * 更新数据的方法
 */
router.put('/:id', async (ctx, next) => {
  let {id}           = ctx.params
  let {name, remark} = ctx.request.body
  let status         = ctx.request.body.status ? ctx.request.body.status : 1

  await SlideModel.update({name, remark, status}, {where: {id: id}}).then(async (s) => {
    ctx.body = {code: 0, msg: '修改成功'}
  }).catch((e) => {
    ctx.body = {code: 400, msg: e.message}
  })
})

/**
 * 删除数据的方法
 */
router.delete('/destroy', async (ctx, next) => {
  let config      = common.bodySqlReady(ctx)
  let configSlide = common.bodySqlReady({request:{body: {where: {slide_id: ctx.request.body.where.id}}}})

  try {
    await SlideItemModel.destroy(configSlide)
    await SlideModel.destroy(config)
  }catch (e){
    ctx.body = {code: 400, msg: e.message}
  }

  ctx.body = {code: 0, msg: '删除成功'}
})

module.exports = router