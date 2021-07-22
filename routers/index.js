const common = require('../lib/common')

module.exports = app => {
  let files   = common.readFileList(__dirname);    //获取该路径下的所有文件,包括文件夹
  let jsFiles = files.filter((f) => {              //筛选一下如果有 -router.js就保留
    return f.endsWith('-router.js');
  }, files);

  for (let file of jsFiles) {
    let router = require(file)
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}