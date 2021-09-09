const Router          = require("@koa/router")                          //路由
const router          = new Router({prefix: '/admin/nav-item'})         //实例化定义前戳
const adminMiddleware = require('./middleware');adminMiddleware(router)

/**
 * 数据列表页
 */
router.get('/index', async (ctx, next) => {
  await ctx.render('admin/nav-item/index', {id: ctx.qs.id})
})

/**
 * 创建页面
 */
router.get('/create', async (ctx, next) => {
  await ctx.render('admin/nav-item/create')
})

/**
 * 编辑页面
 */
router.get('/:id/edit', async (ctx, next) => {
  let {id} = ctx.params
  await ctx.render('admin/nav-item/edit', {updateUrl: `/api/nav-item/${id}`})
})

/**
 * set参数页面
 */
router.get('/:id/option-set', async (ctx, next) => {
  let {id} = ctx.params
  await ctx.render('admin/nav-item/option-set', {updateUrl: `/api/nav-item/${id}`})
})

module.exports = router