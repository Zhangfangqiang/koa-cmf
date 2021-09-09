const Router               = require("@koa/router")                          //路由
const router               = new Router({prefix: '/api/category-content'})   //实例化定义前戳
const common               = require('../../lib/common')                     //常用
const ContentModel         = require('../../models/content-model')           //用户模型
const apiMiddleware        = require('./middleware');apiMiddleware(router)
const CategoryContentModel = require('../../models/category-content-model')  //用户模型

/**
 * 返回数据列表 正在使用
 */
router.get('/index', async (ctx, next) => {
  var data          = []
  var {count, rows} = await CategoryContentModel.findAndCountAll({
    ...common.getSqlReady(ctx),
    order  : [['list_order', 'ASC']],
    include:[{ model: ContentModel}]
  })

  //rows.forEach(item=>{data.push(item.content)})
  ctx.body = {code: 0, msg: 'ok', data:rows , count}
})

module.exports = router