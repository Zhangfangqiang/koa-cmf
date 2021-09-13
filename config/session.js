const store           = require('koa-session-local')           //为了将session存在内存中的模块

module.exports = {
  store : new store(),
  key   : 'koa.sess',     /** （字符串）cookie 键（默认为 koa.sess） */
  /**
   * (number || 'session') maxAge 以毫秒为单位（默认为1天）
   * 'session' 会导致 cookie 在会话/浏览器关闭时过期
   * 警告：如果会话 cookie 被盗，此 cookie 将永不过期
   */
  maxAge    : 86400000,
  autoCommit: true,   /** (boolean) 自动提交标头 (默认为 true) */
  overwrite : true,   /** (boolean) 可以覆盖或不覆盖 (默认为 true) */
  httpOnly  : true,   /** (boolean) httpOnly or not (默认为 true) */
  signed    : true,   /** (boolean) 签名与否（默认为 true） */
  rolling   : false,  /** (boolean) 强制在每个响应上设置会话标识符 cookie。到期重置为原来的maxAge，重置到期倒计时。(默认为 is false) */
  renew     : false,  /** (boolean) 当会话即将到期时更新会话，因此我们可以始终保持用户登录状态. (默认为 is false)*/
  secure    : false,  /** (boolean) 安全 cookie*/
  sameSite  : null,   /** (string) session cookie 相同点选项 (默认为 null, don't set it) */
}
