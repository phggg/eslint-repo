const parser = require('@babel/parser') //将源代码解析成AST
const traverse = require('@babel/traverse').default //对AST节点进行递归遍历，生成一个便于操作、转换的path对象
const generator = require('@babel/generator').default //将AST解码回js代码
const babelTypes = require('@babel/types') //对具体的AST节点进行增删改查

let code = `const sum = (a, b) => {
  console.log(this.a)
  return a + b
}`

// 1.将代码转成ast
const ast = parser.parse(code)
// console.log(ast);

traverse(ast, {
  ArrowFunctionExpression: {
    enter(path) {
      path.node.type = 'FunctionExpression'
      let body = path.node.body
      // console.log(body);
      const thisEnv = path.findParent(parent => parent.isFunction() && !parent.isArrowFunctionExpression() || parent.isProgram())
      const bingingThis = '_this'
      thisEnv.scope.push({
        id: babelTypes.identifier(bingingThis),
        init: babelTypes.thisExpression()
      })
      
      path.traverse({
        ThisExpression: {
          enter(thisPath) {
            thisPath.replaceWith(babelTypes.identifier(bingingThis))
          }
        }
      })
      if (!babelTypes.isBlockStatement(body)) {
        // 查找父作用域
        path.node.body = babelTypes.blockStatement([babelTypes.returnStatement(body)])
      }
    }
  },
  VariableDeclaration: {
    enter(path) {
      path.node.kind = 'var'
    }
  }
})
const { code: code1 } = generator(ast)
console.log(code1)
