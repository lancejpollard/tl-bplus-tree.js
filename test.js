
const ITree = require('./i')

const list = new ITree
let i = 0
while (i < 256) {
  list.push(`val${i++}`)
}
list.insertItemAt(100, 'foo100')
console.log(list.root.children)

