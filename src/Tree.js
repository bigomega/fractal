class TreeNode {
  constructor(text = '', parent = null, children = []) {
    this.id = TreeNode.id++
    this.value = text
    this.parent = parent
    this.children = children
    return this
  }

  addChild(child) {
    this.children.push(child)
  }
}

TreeNode.id = 1

class Tree {
  constructor(text = '') {
    this.root = this.head = new TreeNode(text)
    return this
  }

  goUp(){
    this.head = this.head.parent
    return this
  }

  addNext(text, id) {
    const head = this.find(id)
    const n = new TreeNode(text, head)
    head.addChild(n)
    this.head = n
  }

  addParallel(text) {
    this.goUp().addNext(text)
  }

  find(id) {
    if(!id) { return this.head }
    let stack = [this.root]
    while(stack.length) {
      const node = stack.pop()
      if (node.id === id) { return node }
      stack = stack.concat(node.children)
    }
    return this.head
  }

  setHead(id) {
    this.head = this.find(id)
  }

  log() {
    ;(function traverse(node, depth) {
      console.log(Array(depth).join('- '), node.value, `(${node.id})`)
      node.children.forEach(ch => traverse(ch, depth + 1))
    })(this.root, 1)
  }
}

export default Tree

/*
// Test
var a = new Tree('Hello world')
a.addNext('Okay world, I love you')
a.addParallel('No no no, I hate you')
a.addNext('But why?')
a.addNext('Oh, Shut up')
a.addNext('I love you too', 2)
a.addNext('The world loves me')
a.addParallel('No wait, it doesnt')
a.addNext('Im so happy', 7)
a.log()

*/
