module.exports = (router)  => {
  router.use(async (ctx, next) => {
    console.log('用户已登录',ctx.session.user)

    /*登陆走这里*/
    if (ctx.session.user) {
      if (ctx.url.includes('login')) {
        ctx.redirect('/admin/index/index');
      }
    }
    /*没登陆走这里*/
    else {
      if (!ctx.url.includes('login')) {
        ctx.redirect('/admin/user/login');
      }
    }

    await next()

  })
}