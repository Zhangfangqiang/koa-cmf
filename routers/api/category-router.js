const Router        = require("@koa/router")                          //路由
const router        = new Router({prefix: '/api/category'})           //实例化定义前戳
const common        = require('../../lib/common')                     //常用
const apiMiddleware = require('./middleware');apiMiddleware(router)
const CategoryModel = require('../../models/category-model')          //用户模型

/**
 * 返回数据列表 正在使用
 */
router.get('/index', async (ctx, next) => {

  var {count, rows} = await CategoryModel.findAndCountAll(common.getSqlReady(ctx))

  console.log(ctx.qs)

  if (!ctx.qs.where && ctx.qs.tree) {
    rows = common.getTree(rows)
  }

  ctx.body = {code: 0, msg: 'ok', data: rows, count}
})

/**
 * 返回数据列表 方式0
 */
router.get('/index0', async (ctx, next) => {
  if (ctx.qs.tree) {
    var   include        = []
    const heightLevelRow = await CategoryModel.findOne({order: [['level', 'DESC']], attributes: ['level']})

    for (let i = 0; i < heightLevelRow['level']; i++) {
      if (!include) {
        include = [{model: CategoryModel, required: true}]
      } else {
        include = [{model: CategoryModel, required: true, include}]
      }
    }
    var {count, rows} = await CategoryModel.findAndCountAll({where: {parent_id: null}, include})
  } else {
    var {count, rows} = await CategoryModel.findAndCountAll(common.getSqlReady(ctx))
  }

  ctx.body = {code: 0, msg: 'ok', data: rows, count}
})

/**
 * 创建分类的方法
 */
router.post('/create', async (ctx, next) => {
  let path  = 0
  let level = 0
  let {parent_id, name, description, seo_title, seo_keywords, list_tpl, details_tpl} = ctx.request.body
  if (parent_id == '') {parent_id = null}
  if (parent_id) {
    parentCategory = await CategoryModel.findByPk(parent_id)
    level          = parentCategory.level + 1
    path           = parentCategory.path + ',' + parentCategory.id
  }

  await CategoryModel.create({path, level, parent_id, name, description, seo_title, seo_keywords, list_tpl, details_tpl}).then((s) => {
    ctx.body = {code: 0, msg: '成功'}
  }).catch((e) => {
    console.log(e)
    ctx.body = {code: 400, msg: e.message}
  })
})

/**
 * 获取一条数据
 */
router.get('/:id', async (ctx, next) => {
  let {id}   = ctx.params
  let config = common.getSqlReady(ctx)

  await CategoryModel.findByPk(id, config).then((user) => {
    ctx.body = {code: 0, msg: 'ok', data: user}
  })
})

/**
 * 更新数据的方法
 */
router.put('/:id', async (ctx, next) => {
  let path  = 0
  let level = 0
  let {id}  = ctx.params
  let {parent_id, name, description, seo_title, seo_keywords, list_tpl, details_tpl} = ctx.request.body

  if (parent_id == '') {parent_id = null}

  if (parent_id) {
    if (parent_id == id) {
      ctx.body = {code: 400, msg: '自己不能作为自己的上级'};return
    }

    parentCategory = await CategoryModel.findByPk(parent_id)
    let pathArr    = parentCategory.path.split(',')

    if (pathArr.indexOf(id) != -1) {
      ctx.body = {code: 400, msg: '自己的下级不能作为自己的上级'};return
    }

    level          = parentCategory.level + 1
    path           = parentCategory.path + ',' + parentCategory.id
  }

  await CategoryModel.update(
    {path, level, parent_id, name, description, seo_title, seo_keywords, list_tpl, details_tpl},
    {where: {id: id}}
  ).then(async (s) => {
    var upCategory = await CategoryModel.findByPk(id)     //查看我刚刚更新的数据
    await recursionChangePath(upCategory, id)
    ctx.body = {code: 0, msg: '修改成功'}
  }).catch((e) => {
    ctx.body = {code: 400, msg: e.message}
  })
})

/**
 * 递归更新后面子类的方法
 * @param data      是我自己的数据
 * @param id
 * @returns {Promise<void>}
 */
async function recursionChangePath(data, id) {
  if (children = await CategoryModel.findAll({where: {parent_id: id}})) {

    /*循环所有子类*/
    children.forEach(async (item) => {
      let level = data.level + 1
      let path  = data.path + ',' + data.id

      await CategoryModel.update({path, level}, {where: {id: item.id}}).then(async (s) => {
        var upCategory = await CategoryModel.findByPk(item.id)
        recursionChangePath(upCategory, item.id)
      })
    })
  }
}

/**
 * 删除数据的方法
 */
router.delete('/destroy', async (ctx, next) => {
  let config = common.bodySqlReady(ctx)
  await UserModel.destroy(config).then((s)=>{
    ctx.body = {code: 0, msg: '删除成功'}
  })
})

module.exports = router