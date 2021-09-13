const Router          = require("@koa/router")                          //路由
const router          = new Router({prefix: '/admin/user'})             //实例化定义前戳
const UserModel       = require('../../models/user-model')              //用户模型
const casual          = require('casual');                              //假数据生成
const md5             = require('md5')                                  //md5
const common          = require('../../lib/common')                     //引入常用函数
const adminMiddleware = require('./middleware');adminMiddleware(router)


/**
 * 生成测试数据
 */
router.get('/createTestData', async (ctx, next) => {

  let userData = []

  for (let i = 0; i < 100; i++) {
    userData.push({
      type         : casual.integer(1, 2),
      status       : casual.integer(1, 3),
      open_id      : md5(casual.random),
      login_name   : casual.username,
      nick_name    : casual.username,
      email        : casual.email,
      phone        : casual.phone,
      password     : common.createPassword('123456'),
      avatar_url   : casual.random_element(['https://www.zfajax.com/wp-content/uploads/2021/07/O1CN01zoxGfF1CyHhWTWUOt_0-item_pic.jpg_460x460Q90.jpg_.jpg', 'https://www.zfajax.com/wp-content/uploads/2021/07/O1CN01aMsYKT25KiJTdcLuX_0-item_pic.jpg_460x460Q90.jpg_.jpg']),
      sex          : casual.integer(1, 2),
      country      : casual.country,
      province     : casual.country,
      city         : casual.city,
      last_login_ip: casual.ip,
      last_login_at: casual.date(),
    })
  }

   await UserModel.bulkCreate(userData).then((s)=>{ctx.body = '生成数据成功'}).catch(()=>{ctx.body = '生成数据失败'});
})

/**
 * 登陆页面
 */
router.get('/login', async (ctx, next) => {
  await ctx.render('admin/user/login')
})

/**
 * 数据列表页
 */
router.get('/index', async (ctx, next) => {
  await ctx.render('admin/user/index')
})

/**
 * 创建页面
 */
router.get('/create', async (ctx, next) => {
  await ctx.render('admin/user/create')
})

/**
 * 编辑页面
 */
router.get('/:id/edit', async (ctx, next) => {
  let {id} = ctx.params
  await ctx.render('admin/user/edit', {updateUrl: `/api/user/${id}`})
})

module.exports = router