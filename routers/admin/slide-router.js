const Router          = require("@koa/router")                           //路由
const router          = new Router({prefix: '/admin/slide'})             //实例化定义前戳
const adminMiddleware = require('./middleware');adminMiddleware(router)

/**
 * 登陆页面
 */
router.get('/login', async (ctx, next) => {
  await ctx.render('admin/slide/login')
})

/**
 * 数据列表页
 */
router.get('/index', async (ctx, next) => {
  await ctx.render('admin/slide/index')
})

/**
 * 创建页面
 */
router.get('/create', async (ctx, next) => {
  await ctx.render('admin/slide/create')
})

/**
 * 编辑页面
 */
router.get('/:id/edit', async (ctx, next) => {
  let {id} = ctx.params
  await ctx.render('admin/slide/edit', {updateUrl: `/api/slide/${id}`})
})

module.exports = router