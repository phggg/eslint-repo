const esprima = require('esprima')
const estraverse = require('estraverse')
const escodegen = require('escodegen')


let code = `
function a() {
	console.log('123')
}`

// 1.将代码转成ast
const ast = esprima.parseScript(code)
// console.log(ast);

estraverse.traverse(ast, {
  enter(node) {
    console.log('enter:' + node.type);
    if(node.type === 'FunctionDeclaration') {
      node.id.name = 'esprima'
    }
  },
  leave(node) {
    console.log('leave:' + node.type);
  }
})


const res = escodegen.generate(ast)
console.log(res)
