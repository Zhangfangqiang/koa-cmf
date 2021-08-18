const path           = require('path');
const Router         = require("@koa/router")                          //路由
const router         = new Router({prefix: '/api/slide-item'})         //实例化定义前戳
const common         = require('../../lib/common')                     //常用
const apiMiddleware  = require('./middleware');apiMiddleware(router)
const SlideItemModel = require('../../models/slide-item-model')        //用户模型

/**
 * 返回数据列表 正在使用
 */
router.get('/index', async (ctx, next) => {
  var {count, rows} = await SlideItemModel.findAndCountAll({...common.getSqlReady(ctx), order: [['list_order', 'ASC']]})
           ctx.body = {code: 0, msg: 'ok', data: rows, count}
})

/**
 * 创建分类的方法
 */
router.post('/create', async (ctx, next) => {
  var   file       = {}
  var   {slide_id} = ctx.qs
  const savePath   = path.join(__dirname, '../../public/upload')

  /*单文件*/
  if (ctx.request.files.file  && ctx.request.files.file instanceof Object) {
    file = common.mvFile(ctx.request.files.file, savePath, ctx)
  }

  await SlideItemModel.create({slide_id, status: 2, title: file.fileName, path: file.filePath, url: file.fileUrl, target: '_self',}).then((s) => {
    ctx.body = {code: 0, msg: '成功', data: file}
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

  await SlideItemModel.findByPk(id, config).then((user) => {
    ctx.body = {code: 0, msg: 'ok', data: user}
  })
})

/**
 * 更新数据的方法
 */
router.put('/:id', async (ctx, next) => {
  let {id}          = ctx.params
  let {value,field} = ctx.request.body

  await SlideItemModel.update(JSON.parse(`{"${field}":"${value}"}`),{where: {id: id}})
  ctx.body = {code: 0, msg: '成功'}
})

/**
 * 删除数据的方法
 */
router.delete('/destroy', async (ctx, next) => {
  let config = common.bodySqlReady(ctx)
  await SlideItemModel.destroy(config).then((s)=>{
    ctx.body = {code: 0, msg: '删除成功'}
  })
})

module.exports = router