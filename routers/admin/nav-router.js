const Router          = require("@koa/router")                          //路由
const router          = new Router({prefix: '/admin/nav'})              //实例化定义前戳
const adminMiddleware = require('./middleware');adminMiddleware(router)

/**
 * 登陆页面
 */
router.get('/login', async (ctx, next) => {
  await ctx.render('admin/nav/login')
})

/**
 * 数据列表页
 */
router.get('/index', async (ctx, next) => {
  await ctx.render('admin/nav/index')
})

/**
 * 创建页面
 */
router.get('/create', async (ctx, next) => {
  await ctx.render('admin/nav/create')
})

/**
 * 编辑页面
 */
router.get('/:id/edit', async (ctx, next) => {
  let {id} = ctx.params
  await ctx.render('admin/nav/edit', {updateUrl: `/api/nav/${id}`})
})

module.exports = router