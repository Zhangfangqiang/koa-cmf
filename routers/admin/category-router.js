const Router          = require("@koa/router")                          //路由
const router          = new Router({prefix: '/admin/category'})         //实例化定义前戳
const CategoryModel   = require('../../models/category-model')          //分类模型
const casual          = require('casual');                              //假数据生成
const common          = require('../../lib/common')                     //引入常用函数
const adminMiddleware = require('./middleware');adminMiddleware(router)


/**
 * 生成用户测试数据
 */
router.get('/createTestData', async (ctx, next) => {
  ctx.body = '生成测试数据'
})

/**
 * 用户数据列表页
 */
router.get('/index', async (ctx, next) => {
  await ctx.render('admin/category/index')
})

/**
 * 创建用户页面
 */
router.get('/create', async (ctx, next) => {
  await ctx.render('admin/category/create')
})

/**
 * 编辑用户页面
 */
router.get('/:id/edit', async (ctx, next) => {
  let {id} = ctx.params
  await ctx.render('admin/category/edit', {updateUrl: `/api/category/${id}`})
})

module.exports = router