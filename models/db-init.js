const path   = require('path')
const db     = require("./db-mysql")
const common = require('../lib/common')

module.exports = () => {
  let files   = common.readFileList(__dirname);    //获取该路径下的所有文件,包括文件夹
  let jsFiles = files.filter((file) => {           //筛选一下如果有 -router.js就保留
    return file.endsWith('-model.js');
  }, files);

  /*排序有的表不先注册关联不上*/
  let order = [
    'user-model.js',
    'address-model.js',
    'category-model.js',
    'content-model.js',
    'category-content-model.js',
    'slide-model.js',
    'content-attr-key-model.js',
    'content-attr-value-model.js',
    'content-cart-model.js',
    'content-sku-model.js',
    'nav-item-model.js',
    'nav-model.js',
    'session-key-model.js',
    'slide-item-model.js',
  ];

  jsFiles.sort((a,b)=>{
    return order.indexOf(path.basename(a)) - order.indexOf(path.basename(b));
  });

  for (let file of jsFiles) { require(file) }
  db.sync({alter: true})
}




