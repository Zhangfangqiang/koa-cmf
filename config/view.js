const path         = require('path');                  //路径拼接
const htmlMinifier = require('html-minifier')          //用于压缩html的
const  common      = require("../lib/common")          //用于处理时间的

/**
 * 为了带不改变源代码
 * @type {{test: RegExp, use: (function(*, *, *, *=): {}), _split: (function(*): string[])}}
 */
const artRule = {
  test  : /{{([@!#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*}}/,
  use   : function use(match, raw, close, code) {
    var compiler  = this;
    var options   = compiler.options;
    var esTokens  = compiler.getEsTokens(code);
    var values    = esTokens.map(function (token) {
      return token.value;
    });
    var result    = {};
    var group     = void 0;
    var output    = raw ? 'raw' : false;
    var key       = close + values.shift();

    // 旧版语法升级提示
    var warn = function warn(oldSyntax, newSyntax) {
      console.warn((options.filename || 'anonymous') + ':' + (match.line + 1) + ':' + (match.start + 1) + '\n' + ('Template upgrade: {{' + oldSyntax + '}} -> {{' + newSyntax + '}}'));
    };

    // v3 compat: #value
    if (raw === '#') {
      warn('#value', '@value');
    }

    switch (key) {
      case 'set':
        code = 'var ' + values.join('').trim();
        break;
      case 'if':
        code = 'if(' + values.join('').trim() + '){';
        break;
      case 'else':
        var indexIf = values.indexOf('if');

        if (~indexIf) {
          values.splice(0, indexIf + 1);
          code = '}else if(' + values.join('').trim() + '){';
        } else {
          code = '}else{';
        }

        break;
      case '/if':
        code = '}';
        break;
      case 'each':
        group = artRule._split(esTokens);
        group.shift();

        if (group[1] === 'as') {
          // ... v3 compat ...
          warn('each object as value index', 'each object value index');
          group.splice(1, 1);
        }

        var object = group[0] || '$data';
        var value  = group[1] || '$value';
        var index  = group[2] || '$index';
            code   = '$each(' + object + ',function(' + value + ',' + index + '){';
        break;
      case '/each':
        code = '})';
        break;
      case 'block':
        group = artRule._split(esTokens);
        group.shift();
        code  = 'block(' + group.join(',').trim() + ',function(){';
        break;
      case '/block':
        code = '})';
        break;
      case 'echo':
        key = 'print';
        warn('echo value', 'value');
      case 'print':
      case 'include':
      case 'extend':
        if (values.join('').trim().indexOf('(') !== 0) {
          // 执行函数省略 `()` 与 `,`
          group = artRule._split(esTokens);
          group.shift();
          code  = key + '(' + group.join(',') + ')';
          break;
        }
      default:
        if (~values.indexOf('|')) {
          var v3split = ':'; // ... v3 compat ...

          // 将过滤器解析成二维数组
          var _group = esTokens.reduce(function (group, token) {
            var value = token.value,
                type  = token.type;

            if (value === '|') {
              group.push([]);
            } else if (type !== 'whitespace' && type !== 'comment') {
              if (!group.length) {
                group.push([]);
              }
              if (value === v3split && group[group.length - 1].length === 1) {
                warn('value | filter: argv', 'value | filter argv');
              } else {
                group[group.length - 1].push(token);
              }
            }
            return group;
          }, []).map(function (g) {
            return artRule._split(g);
          });

          // 将过滤器管道化
          code = _group.reduce(function (accumulator, filter) {
            var name = filter.shift();
            filter.unshift(accumulator);

            return '$imports.' + name + '(' + filter.join(',') + ')';
          }, _group.shift().join(' ').trim());
        }

        output = output || 'escape';
        break;
    }

    result.code   = code;
    result.output = output;

    /**
     * 为了带抑制作用的
     */
    if (raw === '!') {
      result.code = "\"{{" + code + "}}\"";
    }

    return result;
  },
  _split: function _split(esTokens) {
    esTokens = esTokens.filter(function (_ref) {
      var type = _ref.type;
      return type !== 'whitespace' && type !== 'comment';
    });

    var current    = 0;
    var lastToken  = esTokens.shift();
    var punctuator = 'punctuator';
    var close      = /\]|\)/;
    var group      = [[lastToken]];

    while (current < esTokens.length) {
      var esToken = esTokens[current];
      if (esToken.type === punctuator || lastToken.type === punctuator && !close.test(lastToken.value)) {
        group[group.length - 1].push(esToken);
      } else {
        group.push([esToken]);
      }
      lastToken = esToken;
      current++;
    }

    return group.map(function (g) {
      return g.map(function (g) {
        return g.value;
      }).join('');
    });
  }
}

module.exports = {
  minimize     : false,
  cache        : false,
  compileDebug : true,
  htmlMinifier : htmlMinifier,
  htmlMinifierOptions: {
    collapseWhitespace   : true,
    minifyCSS            : true,
    minifyJS             : true,
    ignoreCustomFragments: []       // 运行时自动合并：rules.map(rule => rule.test)
  },
  root    : path.join(__dirname, '../views'),
  escape  : true,
  extname : '.html',
  debug   : process.env.NODE_ENV !== 'production',
  imports : common,
  static  : {rootDir: 'public', rootPath: '/public'},
  rules   : [
    {test   : /<%(#?)((?:==|=#|[=-])?)[ \\t]*([\\w\\W]*?)[ \\t]*(-?)%>/},
    artRule
  ]
}





