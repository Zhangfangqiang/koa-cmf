const { Op }               = require("sequelize");                           //where 条件
const Router               = require("@koa/router")                          //路由
const router               = new Router({prefix: '/api/content'})            //实例化定义前戳
const common               = require('../../lib/common')                     //常用
const apiMiddleware        = require('./middleware');apiMiddleware(router)
const ContentModel         = require('../../models/content-model')           //用户模型
const CategoryModel        = require('../../models/category-model')
const UserModel            = require('../../models/user-model')
const CategoryContentModel = require('../../models/category-content-model')

/**
 * 返回数据列表 正在使用
 */
router.get('/index', async (ctx, next) => {
  let sql           = common.getSqlReady(ctx)
  let count         = await ContentModel.count(sql)
      sql.include   = [{model: CategoryModel}, {model: UserModel}]
  let data          = await ContentModel.findAll(sql)

  ctx.body = {code: 0, msg: 'ok', data, count}
})

/**
 * 获取一条数据
 */
router.get('/:id', async (ctx, next) => {
  let {id}        = ctx.params
  let sql         = common.getSqlReady(ctx)
      sql.include = [{model: CategoryModel}, {model: UserModel}]

  await ContentModel.findByPk(id, sql).then((s) => {
    ctx.body = {code: 0, msg: 'ok', data: s}
  })
})

/**
 * 更新数据的方法
 */
router.put('/:id', async (ctx, next) => {
  let {id}  = ctx.params
  let path  = 0
  let level = 0
  let {
    parent_id,  title,       list_order,   keywords, source,
    excerpt,    thumbnail,   images_urls,  images_names,
    file_urls,  file_names,  audio_urls,   audio_names,
    video_urls, video_names, content,      content_filtered,
    category_id,
  }         = ctx.request.body
  let more  = common.dbMoreCreate(file_names, audio_names, video_names, images_names, file_urls, audio_urls, video_urls, images_urls)

  if (parent_id == '') {parent_id = null}
  if (parent_id) {
    parentContent = await ContentModel.findByPk(parent_id)
    level         = parentContent.level + 1
    path          = parentContent.path + ',' + parentContent.id
  }

  await CategoryContentModel.destroy({where: {content_id: id}})
  await ContentModel.update({
    content, content_filtered, parent_id, title, list_order, keywords,
    source, excerpt, thumbnail, more, path, level, user_id: ctx.user.id
  }, {where: {id: id}}
  ).then(async (s) => {
    await category_id.split(',').forEach(async (item) => {
      console.log(item)
      await CategoryContentModel.create({category_id: item, content_id: id})
    })
    ctx.body = {code: 0, msg: '成功'}
  }).catch((e) => {
    ctx.body = {code: 400, msg: e.message}
  })
})


/**
 * 创建
 */
router.post('/create', async (ctx, next) => {
  let path  = 0
  let level = 0
  let {
    parent_id,  title,       list_order,   keywords, source,
    excerpt,    thumbnail,   images_urls,  images_names,
    file_urls,  file_names,  audio_urls,   audio_names,
    video_urls, video_names, content,      content_filtered,
    category_id,
  }         = ctx.request.body
  let more  = common.dbMoreCreate(file_names, audio_names, video_names, images_names, file_urls, audio_urls, video_urls, images_urls)

  if (parent_id == '') {parent_id = null}
  if (parent_id) {
    parentContent = await ContentModel.findByPk(parent_id)
    level         = parentContent.level + 1
    path          = parentContent.path + ',' + parentContent.id
  }

  await ContentModel.create({
    content, content_filtered, parent_id, title, list_order, keywords,
    source, excerpt, thumbnail, more, path, level, user_id: ctx.user.id
  }).then(async (s) => {
    await category_id.split(',').forEach(async (item) => {
      await CategoryContentModel.create({category_id: item, content_id: s.id})
    })
    ctx.body = {code: 0, msg: '成功'}
  }).catch((e) => {
    ctx.body = {code: 400, msg: e.message}
  })
})

/**
 * 删除数据的方法
 */
router.delete('/destroy', async (ctx, next) => {
  let config = common.bodySqlReady(ctx)

  await CategoryContentModel.destroy({
    where: {
      content_id: ctx.request.body.where.id.in.split(',')
    }
  }).then(async (s) => {
    await ContentModel.destroy(config)
    ctx.body = {code: 0, msg: '删除成功'}
  })

})

module.exports = router