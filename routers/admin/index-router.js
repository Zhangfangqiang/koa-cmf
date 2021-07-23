const Router          = require("@koa/router")                          //路由
const router          = new Router({prefix: '/admin/index'})            //实例化定义前戳
const adminMiddleware = require('./middleware');adminMiddleware(router)

/**
 * 框架页面返回
 */
router.get('/index', async (ctx, next) => {
  await ctx.render('admin/index/index')
})

/**
 * 上传测试页面
 */
router.get('/fileUpload', async (ctx, next) => {
  await ctx.render('admin/index/fileUpload')
})

module.exports = router