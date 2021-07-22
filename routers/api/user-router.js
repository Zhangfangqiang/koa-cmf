const Router    = require("@koa/router")                          //路由
const router    = new Router({prefix: '/api/user'})               //实例化定义前戳
const UserModel = require('../../models/user-model')              //用户模型
const common    = require('../../lib/common')                     //常用

/**
 * 返回数据列表
 */
router.get('/index', async (ctx, next) => {
  var sql   = common.getSqlReady(ctx)

  await UserModel.findAndCountAll(sql).then(async (s) => {
    let {count, rows} = s;
    ctx.body = {code: 0, msg: 'ok', data: rows, count}
  })
})

/**
 * 创建用户方法
 */
router.post('/create', async (ctx, next) => {
  let {nick_name, email, password} = ctx.request.body
      password   = common.createPassword(password)
  let avatar_url = 'https://www.zfajax.com/wp-content/uploads/2021/07/srchttp___pic4.zhimg_.com_50_v2-791b5947478755503749ff6675a52366_hd.jpgreferhttp___pic4.zhimg_.jpg'

  await UserModel.create({nick_name, email, password, avatar_url}).then((s) => {
    ctx.body = {code: 0, msg: '成功'}
  }).catch((e) => {
    console.log(e)
    ctx.body = {code: 400, msg: e.message}
  })
})

/**
 * 获取单个用户数据
 */
router.get('/:id', async (ctx, next) => {
  let {id}   = ctx.params
  let config = common.getSqlReady(ctx)

  await UserModel.findByPk(id, config).then((user) => {
    ctx.body = {code: 0, msg: 'ok', data: user}
  })
})

/**
 * 更新单条数据
 */
router.put('/:id', async (ctx, next) => {
  let {id}       = ctx.params
  let {password} = ctx.request.body
      password   = common.createPassword(password)
  await UserModel.update({...ctx.request.body, password}, {where: {id: id}}).then(()=>{
    ctx.body = {code: 0, msg: '修改成功'}
  }).catch((e) => {
    console.log(e)
    ctx.body = {code: 400, msg: e.message}
  })
})

/**
 * 删除数据的方法
 */
router.delete('/destroy', async (ctx, next) => {
  let config = common.bodySqlReady(ctx)
  await UserModel.destroy(config).then((s)=>{
    ctx.body = {code: 0, msg: '删除成功'}
  })
})

/**
 * 用户登陆方法
 */
router.post('/login', async (ctx, next) => {
  let {username, password, vercode} = ctx.request.body

 //UserModel.findOne({where:{
 //    password
 //  }})


  console.log(username , password,vercode)

})

module.exports = router