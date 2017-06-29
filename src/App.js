import React, { Component } from 'react'
import cn from 'classnames'
import './App.css'
import Tree from './Tree.js'

window.Tree = Tree
var sampleTree = new Tree('Hello world')
window.sampleTree = sampleTree
sampleTree.addNext('Okay world, I love you')
sampleTree.addParallel('No no no, I hate you')
sampleTree.addNext('But why?')
sampleTree.addNext('Oh, Shut up')
sampleTree.addNext('I love you too', 2)
sampleTree.addNext('The world loves me')
sampleTree.addParallel('No wait, it doesnt')
sampleTree.addNext('Im so happy', 7)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { viewArray: this.getViewArray([]), selectionArray: [] }
    this.addReplyText = this.addReplyText.bind(this)
    this.onInputKeydown = this.onInputKeydown.bind(this)
    this.reply = this.reply.bind(this)
  }

  getViewArray(selectionArray = this.state.selectionArray) {
    let head = sampleTree.root
    let depth = 0
    const viewArray = []
    do { viewArray.push(head) } while(head.children.length && (head = head.children[selectionArray[depth++]] || head.children[0]))
    return viewArray
  }

  addReplyText(id) {
    this.refs.input.value = this.refs.input.value.replace(/^(\/reply \d+ )?/, `/reply ${+id} `)
    this.refs.input.focus()
  }

  reply(e) {
    const regexMatch = this.refs.input.value.match(/^(\/reply (\d+) )?(.*)/)
    sampleTree.addNext(regexMatch[3], +regexMatch[2])
    this.refs.input.value = ''
    this.forceUpdate()
  }

  onInputKeydown(e) {
    if(e.keyCode === 13) {
      this.reply(e)
      e.stopPropagation()
      e.preventDefault()
    }
  }

  render() {
    let siblingCount = 1

    return (
      <div className="app">
        <div className="chat-container">
        {
          this.state.viewArray.map(node => (
            siblingCount = node.parent && node.parent.children.length,
            <div
              className={cn('chat', {
                opened: this.state.opened === node.id,
                siblings: siblingCount > 1,
              })}
              key={node.id}
              onClick={e => this.setState({ opened: node.id })}
            >
              <div className="text"><div className="id">{node.id}</div> {node.value}</div>
              { siblingCount > 1 && <div className="children-count">+{siblingCount - 1}</div> }
              <div className="controls">
                <div className="reply" title="Reply" onClick={e => this.addReplyText(node.id)}>➥ <span>Reply</span></div>
                <div className="star" title="Star">⭐ <span>Star</span></div>
                { node.children.length > 1 && <div className="replies" title="Other Replies">≡ <span>Other repies</span></div> }
                {/*<div className="comment" title="Comment">💬 <span>Comment</span></div>*/}
                { siblingCount > 1 &&
                  [ //<div className="previous" title="Previous" key="prev">◀ <span>Previous</span></div>
                  , <div className="siblings" title="List Alternatives" key="list">≡ <span>List alternatives</span></div>
                  // , <div className="next" title="Next" key="next"><span>Next</span> ▶</div>
                  ]
                }
              </div>
            </div>
          ))
        }
        </div>
        <div className="input-container">
          <textarea placeholder="Type here..." ref="input" onKeyDown={this.onInputKeydown}></textarea>
          <div className="send" onClick={this.reply}>Send</div>
        </div>
      </div>
    )
  }
}

export default App
