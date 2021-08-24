const { Op }                = require("sequelize");                           //where 条件
const Router                = require("@koa/router")                          //路由
const router                = new Router({prefix: '/api/content'})            //实例化定义前戳
const common                = require('../../lib/common')                     //常用
const apiMiddleware         = require('./middleware');apiMiddleware(router)
const UserModel             = require('../../models/user-model')
const ContentModel          = require('../../models/content-model')           //用户模型
const CategoryModel         = require('../../models/category-model')
const ContentSkuModel       = require('../../models/content-sku-model')
const CategoryContentModel  = require('../../models/category-content-model')
const ContentAttrKeyModel   = require('../../models/content-attr-key-model')
const ContentAttrValueModel = require('../../models/content-attr-value-model')

/**
 * 返回数据列表
 */
router.get('/index', async (ctx, next) => {
  let sql           = common.getSqlReady(ctx)
  let count         = await ContentModel.count(sql)
      sql.include   = [{model: CategoryModel}, {model: UserModel}]
  let data          = await ContentModel.findAll(sql)

  ctx.body = {code: 0, msg: 'ok', data, count}
})

/**
 * 返回数据列表 sku
 */
router.get('/sku/index', async (ctx, next) => {
  let id   = ctx.qs.id
  let data = await ContentSkuModel.findAll({where: {content_id: id}})

  ctx.body = {code: 0, msg: 'ok', data}
})

/**
 * 获取一条数据
 */
router.get('/:id', async (ctx, next) => {
  let {id}        = ctx.params
  let sql         = common.getSqlReady(ctx)
      sql.include = [{model: CategoryModel}, {model: UserModel}, {model: ContentSkuModel}, {model: ContentAttrKeyModel, include: ContentAttrValueModel}]

  await ContentModel.findByPk(id, sql).then((s) => {
    ctx.body = {code: 0, msg: 'ok', data: s}
  })
})

/**
 * 更新数据 sku
 */
router.put('/:id/sku', async (ctx, next) => {
  let {id}          = ctx.params
  let {value,field} = ctx.request.body

  await ContentSkuModel.update(JSON.parse(`{"${field}":"${value}"}`),{where: {id: id}})
  ctx.body = {code: 0, msg: '成功'}

})

/**
 * 更新数据
 */
router.put('/:id', async (ctx, next) => {
  let {id}  = ctx.params
  let path  = 0
  let level = 0
  let type  = ctx.qs.type
  let {
    parent_id,  title,       list_order,   keywords, source,
    excerpt,    thumbnail,   images_urls,  images_names,
    file_urls,  file_names,  audio_urls,   audio_names,
    video_urls, video_names, content,      content_filtered,
    category_id,attr_key,    attr_value,   price
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
    source, excerpt, thumbnail, more, path, level, user_id: ctx.user.id,
    type,   price
    }, {where: {id: id}}
  ).then(async (s) => {
    /*分类*/
    category_id.split(',').forEach(async (item) => {
      await CategoryContentModel.create({category_id: item, content_id: id})
    })

    ctx.body = {code: 0, msg: '成功'}
  }).catch((e) => {
    ctx.body = {code: 400, msg: e.message}
  })
})

/**
 * 创建数据
 */
router.post('/create', async (ctx, next) => {
  let path  = 0
  let level = 0
  let type  = ctx.qs.type
  let {
    parent_id,  title,       list_order,   keywords, source,
    excerpt,    thumbnail,   images_urls,  images_names,
    file_urls,  file_names,  audio_urls,   audio_names,
    video_urls, video_names, content,      content_filtered,
    category_id,attr_key,    attr_value,   price
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
    source, excerpt, thumbnail, more, path, level, user_id: ctx.user.id,
    type,   price
  }).then(async (s) => {
    /*分类*/
    category_id.split(',').forEach(async (item) => {
      await CategoryContentModel.create({category_id: item, content_id: s.id})
    })

    /*如果是商品*/
    if (type == 2) {
      /*创建 商品key 和 商品value*/
      let cavids = []
      for (index in attr_key) {
            cavids[index] = []
        let aks           = await ContentAttrKeyModel.create({content_id: s.id, attr_key: attr_key[index]})
        for (i in attr_value[index]) {
          let contentAttrValue = await ContentAttrValueModel.create({content_id: s.id, attr_key_id: aks.id, attr_value: attr_value[index][i]})
              cavids[index][i] = contentAttrValue.id
        }
      }

      /*创建 商品sku*/
      desc_arr     = common.doExchange(attr_value)
      sku_path_arr = common.doExchange(cavids)
      sku_path_arr.forEach(async (item,index) => {
        await ContentSkuModel.create({
          content_id       : s.id,
          content_attr_path: item instanceof Object ? item : [item],
          content_sku_desc : desc_arr[index] instanceof Object ? desc_arr[index].join(',') : desc_arr[index],
          stock            : 0,
          price            : 999999999,
        })
      })
    }

    ctx.body = {code: 0, msg: '成功'}
  }).catch((e) => {
    ctx.body = {code: 400, msg: e.message}
  })
})

/**
 * 删除数据
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