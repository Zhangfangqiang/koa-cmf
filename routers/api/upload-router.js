const Router    = require("@koa/router")                          //路由
const router    = new Router({prefix: '/api/upload'})             //实例化定义前戳
const common    = require('../../lib/common')                     //常用
const path      = require('path');

/**
 * 返回数据列表
 */
router.post('/index', async (ctx, next) => {
  const savePath =  path.join(__dirname, '../../public/upload')

  /*多文件*/
  if (ctx.request.files.files && ctx.request.files.files instanceof Array) {
    const data = [];
    for (item in ctx.request.files.files) {
      data.push(common.mvFile(ctx.request.files.files[item], savePath, ctx))
    }
    ctx.body = {code: 0, data}
  }

  /*单文件*/
  if (ctx.request.files.file  && ctx.request.files.file instanceof Object) {
    const file = common.mvFile(ctx.request.files.file, savePath, ctx)
    ctx.body   = {code: 0, data: file}
  }
})

module.exports = router