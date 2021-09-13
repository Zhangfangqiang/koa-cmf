const path                 = require('path');
const Router               = require("@koa/router")                          //路由
const router               = new Router({prefix: '/api/nav-item'})           //实例化定义前戳
const common               = require('../../lib/common')                     //常用
const apiMiddleware        = require('./middleware');apiMiddleware(router)
const NavItemModel         = require('../../models/nav-item-model')          //用户模型
const ContentModel         = require('../../models/content-model')
const CategoryModel        = require('../../models/category-model')
const CategoryContentModel = require('../../models/category-content-model')


/**
 * 返回数据列表
 */
router.get('/index', async (ctx, next) => {

  var include = []

  if (ctx.qs.category) {
    include.push({model: CategoryModel})
  }

  if (ctx.qs.content) {
    include.push({
      model: CategoryContentModel,
      limit: 10,
      include: [
        ContentModel
      ]
    })
  }

  var {count, rows} = await NavItemModel.findAndCountAll({
    ...common.getSqlReady(ctx),
    order: [['list_order', 'ASC']],
    include
  })

  if (ctx.qs.tree) {
    rows = common.getTree(rows)
  }

  ctx.body = {code: 0, msg: 'ok', data: rows, count}
})

/**
 * 创建数据
 */
router.post('/create', async (ctx, next) => {
  let path     = 0
  let level    = 0
  let {nav_id} = ctx.qs
  let {parent_id, name, content, icon, href, wx_href} = ctx.request.body
  if (parent_id == '') {parent_id = null}
  if (parent_id) {
    navItem = await NavItemModel.findByPk(parent_id)
    level   = navItem.level + 1
    path    = navItem.path + ',' + navItem.id
  }

  await NavItemModel.create({path, level, parent_id, name, content, icon, href, wx_href, nav_id}).then((s) => {
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

  await NavItemModel.findByPk(id, config).then((user) => {
    ctx.body = {code: 0, msg: 'ok', data: user}
  })
})

/**
 * 更新数据
 */
router.put('/:id', async (ctx, next) => {
  let {id}                = ctx.params
  let {value, field, img, option} = ctx.request.body

  if (value) {if (field) {
    await NavItemModel.update(JSON.parse(`{"${field}":"${value}"}`), {where: {id: id}})
  }}
  if (img) {
    await NavItemModel.update({img}, {where: {id: id}})
  }
  if (option) {
    await NavItemModel.update({option}, {where: {id: id}})
  }

  ctx.body = {code: 0, msg: '成功'}
})

/**
 * 删除数据
 */
router.delete('/destroy', async (ctx, next) => {
  let config   = common.bodySqlReady(ctx)
  let children = await NavItemModel.findOne({where: {'parent_id': config.where.id}})

  if (children) {ctx.body = {code: 0, msg: '删除子类后可删除'}}

  await NavItemModel.destroy(config).then((s)=>{
    ctx.body = {code: 0, msg: '删除成功'}
  })
})

module.exports = router