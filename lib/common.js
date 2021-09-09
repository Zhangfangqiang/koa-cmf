const fs          = require('fs')
const path        = require('path')
const md5         = require('md5')
const md5File     = require('md5-file');
const appConfig = require('../config/app')
const { Op }      = require("sequelize");                           //where 条件
const shell       = require('shelljs');
const moment      = require('moment')

/**
 * 递归获取目录
 * 放到 module.exports里没法递归
 * @param dir
 * @param filesList
 * @returns {*[]}
 */
const readFileList = (dir, filesList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((item, index) => {
    let fullPath = path.join(dir, item);                //拼接路径
    let stat = fs.statSync(fullPath);               //获取信息

    if (stat.isDirectory()) {                           //判断是否是目录
      readFileList(path.join(dir, item), filesList);    //递归读取文件
    } else {
      filesList.push(fullPath);                         //入栈
    }
  });

  return filesList;
}

/**
 * 同步递归创建目录
 * @param dirname
 * @returns {boolean}
 */
const mkdirSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

/**
 * 获取树状结构
 * @param data
 * @param parent_id
 * @returns {*[]}
 */
const getTree = (data = [], parent_id = null) => {
  var data = JSON.parse(JSON.stringify(data))
  let itemArr = [];

  for (let i = 0; i < data.length; i++) {
    let node = data[i]
    if (node.parent_id === parent_id) {
      node.open      = true;
      node.children  = getTree(data, node.id);
      itemArr.push(node);
    }
  }
  return itemArr;
}

/**
 * 获取二位数组之间的组合
 * @param arr
 * @returns {*}
 */
const doExchange = (arr) => {
  var len = arr.length;
  //当数组大于等于2个的时候
  if(len >= 2){
    //第一个数组的长度
    var len1 = arr[0].length;
    //第二个数组的长度
    var len2 = arr[1].length;
    //2个数组产生的组合数
    var lenBoth = len1 * len2;
    //申明一个新数组
    var items = new Array(lenBoth);
    //申明新数组的索引
    var index = 0;
    for(var i=0; i<len1; i++){
      for(var j=0; j<len2; j++){
        if(arr[0][i] instanceof Array){
          items[index] = arr[0][i].concat(arr[1][j]);
        }else{
          items[index] = [arr[0][i]].concat(arr[1][j]);
        }
        index++;
      }
    }
    var newArr = new Array(len -1);
    for(var i=2;i<arr.length;i++){
      newArr[i-1] = arr[i];
    }
    newArr[0] = items;
    return doExchange(newArr);
  }else{
    return arr[0];
  }
}


const mergeJSON =(minor, main)=> {
  for (var key in minor) {

    if (main[key] === undefined) {  // 不冲突的，直接赋值
      main[key] = minor[key];
      continue;
    }

    // 冲突了，如果是Object，看看有么有不冲突的属性
    // 不是Object 则以main为主，忽略即可。故不需要else
    if (isJSON(minor[key])) {
      // arguments.callee 递归调用，并且与函数名解耦
      arguments.callee(minor[key], main[key]);
    }
  }
}

const isJSON =(target) =>{
  return typeof target == "object" && target.constructor == Object;
}

module.exports = {
  readFileList,
  doExchange,
  mkdirSync,
  mergeJSON,
  getTree,


  /**
   * 时间戳转文字
   * @param d
   * @param fmt
   * @returns {*}
   */
  dataFormat: (d, fmt) => {
    var o = {
      "M+": d.getMonth() + 1,                                 //月份
      "d+": d.getDate(),                                      //日
      "h+": d.getHours() % 12 == 0 ? 12 : d.getHours() % 12,  //小时
      "H+": d.getHours(),                                     //小时
      "m+": d.getMinutes(),                                   //分
      "s+": d.getSeconds(),                                   //秒
      "q+": Math.floor((d.getMonth() + 3) / 3),            //季度
      "S": d.getMilliseconds()                                //毫秒
    };

    var week = {
      "0": "/u65e5",
      "1": "/u4e00",
      "2": "/u4e8c",
      "3": "/u4e09",
      "4": "/u56db",
      "5": "/u4e94",
      "6": "/u516d"
    };

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[d.getDay() + ""]);
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }

    return fmt;
  },

  /**
   * 将数据循环多次并返还
   * @param times
   * @param generator
   * @returns {*[]}
   */
  arrayFor: function (times, data) {
    var result = [];
    for (var i = 0; i < times; ++i) {
      result.push(data);
    }
    return result;
  },

  /**
   * 生成密码的方法
   * @param string
   * @returns {*}
   */
  createPassword: function (string) {
    return md5(string + appConfig.passwordSecret)
  },

  /**
   * get sql 准备
   * @param ctx
   * @returns {{}}
   */
  getSqlReady: function (ctx) {

    var config = {};

    /*where 条件开始*/
    if (ctx.qs.where) {
      let where        = ctx.qs.where
          config.where = {}

      if (typeof where == 'string') {
        where = JSON.parse(where)
      }

      for (let key in where) {
        if (typeof where[key] == 'object') {
          var whereItem = where[key]
        } else {
          var whereItem = JSON.parse(where[key])
        }
        for (let k in whereItem) {
          switch (k){
            case 'like':
            case 'iLike':
            case 'notLike':
            case 'notILike':
              config.where[key] = {[Op[k]]:'%'+whereItem[k]+'%'}
              break
            case 'in':
            case 'notIn':
              let inArr = whereItem[k].split(',')
              config.where[key] = {[Op[k]]:inArr}
              break
            default:
              config.where[key] = {[Op[k]]:whereItem[k]}
          }
        }
      }
    }

    /*字段筛选*/
    if (ctx.qs.fields) {
      config.attributes = ctx.qs.fields.split(',')
    }

    /*翻页*/
    if (ctx.qs.limit) {
      config.limit  = parseInt(ctx.qs.limit);
      if (ctx.qs.page) {
        config.offset = ctx.qs.limit * (ctx.qs.page - 1)
      }
    }
    return config
  },

  /**
   * body sql 准备
   * @param ctx
   * @returns {{}}
   */
  bodySqlReady: function (ctx) {

    var config = {};

    /*where 条件开始*/
    if (ctx.request.body.where) {
      let where        = ctx.request.body.where
          config.where = {}

      for (let key in where) {
        let whereItem = where[key]
        for (let k in whereItem) {
          switch (k){
            case 'like':
            case 'iLike':
            case 'notLike':
            case 'notILike':
              config.where[key] = {[Op[k]]:'%'+whereItem[k]+'%'}
              break
            case 'in':
            case 'notIn':
              let inArr = whereItem[k].split(',')
              config.where[key] = {[Op[k]]:inArr}
              break
            default:
              config.where[key] = {[Op[k]]:whereItem[k]}
          }
        }
      }
    }

    /*字段筛选*/
    if (ctx.request.body.fields) {
      config.attributes = ctx.request.body.fields.split(',')
    }

    /*翻页*/
    if (ctx.request.body.limit) {
      config.limit  = parseInt(ctx.request.body.limit);
      if (ctx.request.body.page) {
        config.offset = ctx.request.body.limit * (ctx.request.body.page - 1)
      }
    }

    return config
  },

  /**
   * 文件移动
   * @param file
   */
  mvFile: function (file, noTimesavePath, ctx) {
    const savePath    = path.join(noTimesavePath, moment().tz("Asia/Shanghai").format('YYYY-MM'))
    const md5Code     = md5File.sync(file.path);
    const extName     = path.extname(file.name);
    const newFileName = `${md5Code}${extName}`;

    /*创建目录*/
    if (savePath && !fs.existsSync(savePath)) {
      mkdirSync(path.join(savePath));
    }

    /*移动文件*/
    if (savePath && fs.existsSync(savePath)) {
      absolutePath = path.join(savePath, newFileName);
      shell.mv(file.path, absolutePath);
    }
    console.log(ctx.origin)
    let filePath = absolutePath.slice(absolutePath.indexOf('public') - 1, absolutePath.length).replace(/\\/g,"/");
    return {filePath, fileName: newFileName, fileUrl: ctx.origin + filePath}
  },

  /**
   * 将db more数据json化处理
   * @param file_names
   * @param audio_names
   * @param video_names
   * @param images_names
   * @param file_urls
   * @param audio_urls
   * @param video_urls
   * @param images_urls
   */
  dbMoreCreate: function (file_names, audio_names, video_names, images_names, file_urls, audio_urls, video_urls, images_urls) {
    let more         = {}
    let fileNameArr  = [file_names, audio_names, video_names, images_names]
    let fileUrlArr   = [file_urls, audio_urls, video_urls, images_urls]
    let fileJsonName = ['file', 'audio', 'video', 'images']

    fileNameArr.forEach((item, key) => {
      if (item) {
        more[fileJsonName[key]] = [];
        item.forEach((i, k) => {
          more[fileJsonName[key]].push({url: fileUrlArr[key][k], name: i})
        })
      }
    })

    return more;
  }
}