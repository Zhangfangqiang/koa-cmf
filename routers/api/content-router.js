const Router        = require("@koa/router")                          //路由
const router        = new Router({prefix: '/api/content'})            //实例化定义前戳
const common        = require('../../lib/common')                     //常用
const apiMiddleware = require('./middleware');apiMiddleware(router)
const ContentModel  = require('../../models/content-model')           //用户模型
const CategoryModel = require('../../models/category-model')
/**
 * 返回数据列表 正在使用
 */
router.get('/index', async (ctx, next) => {

  let sql         = common.getSqlReady(ctx)
      sql.include = {model: CategoryModel}
  console.log(sql)

  var {count, rows} = await ContentModel.findAndCountAll(sql)


  ctx.body = {code: 0, msg: 'ok', data: rows, count}


 // var {count, rows} = await ContentModel.findAndCountAll(common.getSqlReady(ctx))
})


module.exports = router