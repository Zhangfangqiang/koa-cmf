const Router          = require("@koa/router")                          //路由
const router          = new Router({prefix: '/api/user'})               //实例化定义前戳
const UserModel       = require('../../models/user-model')              //用户模型
const SessionKeyModel = require('../../models/session-key-model')       //用户模型
const common          = require('../../lib/common')                     //常用
const { Op }          = require("sequelize");                           //where 条件
const apiMiddleware   = require('./middleware');apiMiddleware(router)
const jsonwebtoken    = require('jsonwebtoken')                         //签发验证工具
const appConfig       = require('../../config/app')
const util            = require('util');
const weapp           = require('../../config/weapp')                  //weapp配置文件
const WeixinAuth      = require("../../lib/koa2-weixin-auth")          //auth
const weixinAuth      = new WeixinAuth(weapp.miniProgram.appId, weapp.miniProgram.appSecret)      //微信登陆
const WXBizDataCrypt  = require('../../lib/WXBizDataCrypt')            //解密用的


/**
 * 用户登陆方法
 */
router.post('/login', async (ctx, next) => {
  let sessionKey
  let {username, vercode, iv, code, userInfo, encryptedData, sessionKeyIsValid} = ctx.request.body
  let password                                                                  = common.createPassword(ctx.request.body.password)

  /*这里是微信小程序登陆*/
  if(userInfo){
    /*如果客户端有sessionKeyIsValid(token)则传来，解析*/
    if (sessionKeyIsValid) {
      let token = ctx.request.header.authorization
      token = token.split(' ')[1]
      /*token不为空*/
      if (token) {
        let payload = await util.promisify(jsonwebtoken.verify)(token, appConfig.jwtSecret).catch(err => {})    //验证token是否正确
        if (payload){ sessionKey = payload.sessionKey}
      }
    }

    /**
     * 除了尝试从token中获取sessionKey，还可以从数据库中或服务器redis缓存中获取
     * 如果在db或redis中存储，可以与cookie结合起来使用，
     * 目前没有这样做，sessionKey仍然存在丢失的时候，又缺少一个wx.clearSession方法
     */
    if (sessionKeyIsValid && !sessionKey && ctx.session.sessionKeyRecordId) {
      let sessionKeyRecordId  = ctx.session.sessionKeyRecordId
      let sesskonKeyRecordOld = await SessionKeyModel.findOne({where: {id: ctx.session.sessionKeyRecordId}})
      if (sesskonKeyRecordOld) {sessionKey = sesskonKeyRecordOld.sessionKey}
    }

    /* 如果从token中没有取到，则从微信服务器上取一次 */
    if (!sessionKey) {
      const token = await weixinAuth.getAccessToken(code)
      sessionKey = token.data.session_key
    }

    /* 数据解密操作 */
    const pc               = new WXBizDataCrypt(weapp.miniProgram.appId, sessionKey)
    let decryptedUserInfo  = pc.decryptData(encryptedData, iv)

    let user = await UserModel.findOne({where: {open_id: decryptedUserInfo.openId}})
    if (!user) {//如果用户没有查到，则创建
      let createRes = await UserModel.create({
        'open_id'   : decryptedUserInfo.openId,
        'nick_name' : decryptedUserInfo.nickName,
        'sex'       : decryptedUserInfo.gender,
        'language'  : decryptedUserInfo.language,
        'country'   : decryptedUserInfo.country,
        'avatar_url': decryptedUserInfo.avatarUrl,
        'watermark' : decryptedUserInfo.watermark
      })
      if (createRes){ user = createRes.dataValues }
    }

    /* 如果没有session 创建session 有就更新 */
    let sessionKeyRecord = await SessionKeyModel.findOne({where: {user_id: user.id}})    //查询session key
    if (sessionKeyRecord) {
      await sessionKeyRecord.update({sessionKey: sessionKey})
    } else {
      let sessionKeyRecordCreateRes = await SessionKeyModel.create({user_id: user.id, sessionKey: sessionKey})
      sessionKeyRecord = sessionKeyRecordCreateRes.dataValues
    }

    ctx.session.sessionKeyRecordId = sessionKeyRecord.id

    //签数据
    let token   = jsonwebtoken.sign(user.toJSON(), appConfig.jwtSecret, {expiresIn: '3d'})
    ctx.body    = {code: 200, msg: 'ok', data: {...user.toJSON(), token}}

  }else{/*这里是普通后台登陆*/
    let user = await UserModel.findOne({where: {
        [Op.or]: [
          {password: password, phone: username},
          {password: password, email: username},
          {password: password, login_name: username},
        ]}})

    if (!user) {
      ctx.body = {code: 400, msg: '用户不存在'}
      return
    }
    await user.update({'last_login_at': Date()})

    let token        = jsonwebtoken.sign(user.toJSON(), appConfig.jwtSecret, {expiresIn: '3d'})
    ctx.session.user = user
    ctx.body         = {code: 0, msg: '登陆成功', data: {token}}
  }
})

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
 * 创建数据
 */
router.post('/create', async (ctx, next) => {
  let {nick_name, email, password} = ctx.request.body
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
 * 更新数据
 */
router.put('/:id', async (ctx, next) => {
  let {id}       = ctx.params
  let {password} = ctx.request.body

  await UserModel.update({...ctx.request.body, password}, {where: {id: id}}).then(()=>{
    ctx.body = {code: 0, msg: '修改成功'}
  }).catch((e) => {
    console.log(e)
    ctx.body = {code: 400, msg: e.message}
  })
})

/**
 * 删除数据
 */
router.delete('/destroy', async (ctx, next) => {
  let config = common.bodySqlReady(ctx)
  await UserModel.destroy(config).then((s)=>{
    ctx.body = {code: 0, msg: '删除成功'}
  })
})

module.exports = router