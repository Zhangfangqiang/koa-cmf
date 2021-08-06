const Router                = require("@koa/router")                           //路由
const router                = new Router({prefix: '/admin/content'})           //实例化定义前戳
const ContentModel          = require('../../models/content-model')            //分类模型
const CategoryModel         = require('../../models/category-model')           //分类模型
const CategoryContentModel  = require('../../models/category-content-model')   //分类模型
const ContentAttrKeyModel   = require('../../models/content-attr-key-model')   //属性键
const ContentAttrValueModel = require('../../models/content-attr-value-model') //属性值
const ContentSkuModel       = require('../../models/content-sku-model')        //内容sku
const casual                = require('casual');                               //假数据生成
const common                = require('../../lib/common')                      //引入常用函数
const adminMiddleware       = require('./middleware');adminMiddleware(router)

/**
 * 生成测试数据
 */
router.get('/createTestData', async (ctx, next) => {
  /*创建内容*/
  let contentArr = []
  for (let i = 0; i < 500; i++) {
    contentArr.push({
      parent_id       : null,
      path            : 0,
      level           : 0,
      type            : casual.integer(1, 2),
      is_top          : casual.integer(1, 2),
      is_recommended  : casual.integer(1, 2),
      status          : casual.integer(1, 2),
      comment_status  : casual.integer(1, 2),
      format          : casual.integer(1, 2),
      user_id         : 1,
      hits_count      : casual.integer(1, 9999),
      favorites_count : casual.integer(1, 9999),
      like_count      : casual.integer(1, 9999),
      comment_count   : casual.integer(1, 9999),
      title           : casual.title,
      keywords        : casual.word,
      excerpt         : casual.description,
      source          : '原创',
      thumbnail       : '/public/upload/2021-07-28/67c0a736e98a31e410f753d8559d56b0.jpg',
      content         : casual.text,
      content_filtered: casual.text,
      published_at    : casual.date(),
      more            : {},
    })
  }
  await ContentModel.bulkCreate(contentArr)

  let categoryIds        = []
  let categoryContentArr = []
  let category           = await CategoryModel.findAll({attributes:['id']})
  let contents           = await ContentModel.findAll({attributes:['id']})

  category.map((item) => {categoryIds.push(item.id)})
  contents.map((item) => {
    categoryContentArr.push({
      content_id  : item.id,
      category_id : casual.random_element(categoryIds),
      status      : 2
    })
  })

  await CategoryContentModel.bulkCreate(categoryContentArr)


  /*初始化key*/
      contents          = await ContentModel.findAll({where: {type: 2}})
  let contentAttrKeyArr = []
  contents.forEach((value, key) => {
    for (let i = 0; i < 2; i++) {
      contentAttrKeyArr.push({
        content_id: value.id,
        attr_key  : casual.title
      })
    }
  })

  await ContentAttrKeyModel.bulkCreate(contentAttrKeyArr)
  let contentAttrKey = await ContentAttrKeyModel.findAll()

  /*初始化商品value*/
  let contentAttrValueArr = []
  contentAttrKey.forEach((value, key) => {
    for (let i = 0; i < 4; i++) {
      contentAttrValueArr.push({
        content_id  : value.content_id,
        attr_key_id : value.id,
        attr_value  : casual.title
      })
    }
  })
  await ContentAttrValueModel.bulkCreate(contentAttrValueArr)

  /*初始化商品suk表*/
  contents.forEach(async (value, key) => {
    let contentSku      = [];
    let contentAttrKeys = await ContentAttrKeyModel.findAll({
      where: {
        content_id: value.id
      },
      attributes: ['id', 'attr_key', 'content_id'],
      include: [{
        model: ContentAttrValueModel,
        attributes: ['id', 'attr_value', 'attr_key_id', 'content_id']
      }],
      distinct: true
    })
    let doExs = []
    for (let i = 0; i < contentAttrKeys.length; i++) {
      let doEx = []
      for (let j = 0; j < contentAttrKeys[i].content_attr_values.length; j++) {
        doEx.push(contentAttrKeys[i].content_attr_values[j].id)
      }
      doExs.push(doEx)
    }

    let doExchange = common.doExchange(doExs)
    doExchange.forEach((v, k) => {
      contentSku.push({
        content_id        : value.id,
        content_attr_path : v,
        content_sku_desc  : casual.description,
        price             : casual.integer(100, 999999),
        stock             : casual.integer(100, 1000)
      })
    })

    ContentSkuModel.bulkCreate(contentSku)
  })
  ctx.body = '生成数据成功'
})

/**
 * 用户数据列表页
 */
router.get('/index', async (ctx, next) => {
  await ctx.render('admin/content/index')
})

/**
 * 创建用户页面
 */
router.get('/create', async (ctx, next) => {
  let {type} = ctx.qs
  await ctx.render(`admin/content/create${type}`)
})

/**
 * 编辑用户页面
 */
router.get('/:id/edit', async (ctx, next) => {
  let {id}   = ctx.params
  let {type} = ctx.qs
  await ctx.render(`admin/content/edit${type}`, {updateUrl: `/api/content/${id}`})
})

module.exports = router