const Router          = require("@koa/router")                          //路由
const router          = new Router({prefix: '/admin/slide-item'})       //实例化定义前戳
const adminMiddleware = require('./middleware');adminMiddleware(router)

/**
 * 数据列表页
 */
router.get('/index', async (ctx, next) => {
  await ctx.render('admin/slide-item/index', {id: ctx.qs.id})
})

/**
 * 创建页面
 */
router.get('/create', async (ctx, next) => {
  await ctx.render('admin/slide-item/create')
})

/**
 * 编辑页面
 */
router.get('/:id/edit', async (ctx, next) => {
  let {id} = ctx.params
  await ctx.render('admin/slide-item/edit', {updateUrl: `/api/slide-item/${id}`})
})

module.exports = router