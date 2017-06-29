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
    this.state = { viewArray: this.getViewArray(), selectionArray: [], choices: 0, choiceDepth: 0 }
    this.addReplyText = this.addReplyText.bind(this)
    this.onInputKeydown = this.onInputKeydown.bind(this)
    this.reply = this.reply.bind(this)
    this.choose = this.choose.bind(this)
  }

  getViewArray() {
    const selectionArray = this.state && this.state.selectionArray || []
    let head = sampleTree.root
    const viewArray = []
    do { viewArray.push(head) } while(head.children.length && (head = head.children[selectionArray[head.depth]] || head.children[0]))
    return viewArray
  }

  addReplyText(id) {
    this.refs.input.value = this.refs.input.value.replace(/^(\/reply \d+ )?/, `/reply ${+id} `)
    this.refs.input.focus()
  }

  reply(e) {
      let regexMatch
    if(this.state.choices) {
      regexMatch = this.refs.input.value.match(/^\/choose (\d+)/)
      if(!regexMatch || !+regexMatch[1]) {
        alert('choose first!!!\nyou can click or type `/choose <choice number>`');
        return;
      }
      this.choose(+regexMatch[1])
      this.refs.input.value = ''
      return
    }
    regexMatch = this.refs.input.value.match(/^(\/reply (\d+) )?(.*)/)
    sampleTree.addNext(regexMatch[3], +regexMatch[2])
    this.refs.input.value = ''
    this.setState({ viewArray: this.getViewArray() })
  }

  choose(choiceNo) {
    const selectionArray = this.state.selectionArray.slice()
    selectionArray[this.state.choiceDepth] = choiceNo - 1
    this.setState({ opened: null, selectionArray, choices: 0 }, () => this.setState({ viewArray: this.getViewArray() }))
  }

  showReplies(id) {
    const selectionArray = this.state.selectionArray
    let head = sampleTree.root
    const viewArray = []
    do {
      viewArray.push(head)
    } while(head.id !== id && head.children.length && (head = head.children[selectionArray[head.depth]] || head.children[0]))
    this.setState({
      viewArray: viewArray.concat(head.children),
      choices: head.children.length,
      choiceDepth: viewArray[viewArray.length - 1].depth,
    })
  }

  onInputKeydown(e) {
    if(e.keyCode === 13) {
      this.reply(e)
      e.stopPropagation()
      e.preventDefault()
    }
  }

  render() {
    let tmp = {}

    return (
      <div className="app">
        <div className="chat-container">
        {
          this.state.viewArray.map((node, i) => (
            tmp.choiceNo = this.state.viewArray.length - i <= this.state.choices ? this.state.choices + 1 - this.state.viewArray.length + i : '',
            tmp.siblingCount = !tmp.choiceNo && node.parent && node.parent.children.length,
            <div
              className={cn('chat', {
                opened: !tmp.choiceNo && this.state.opened === node.id,
                siblings: tmp.siblingCount > 1,
                choice: tmp.choiceNo,
              })}
              key={node.id}
              onClick={(choiceNo => e => {
                if(choiceNo) {
                  this.choose(choiceNo)
                } else {
                  this.setState({ opened: node.id })
                }
              })(tmp.choiceNo)}
            >
              <div className="text"><div className="id">{this.state.choices ? tmp.choiceNo : node.id}</div> {node.value}</div>
              { tmp.siblingCount > 1 && <div className="children-count">+{tmp.siblingCount - 1}</div> }
              <div className="controls">
                <div className="reply" title="Reply" onClick={e => this.addReplyText(node.id)}>➥ <span>Reply</span></div>
                <div className="star" title="Star">⭐ <span>Star</span></div>
                { node.children.length > 1 && <div className="replies" title="Other Replies">≡ <span>See other repies</span></div> }
                {/*<div className="comment" title="Comment">💬 <span>Comment</span></div>*/}
                { tmp.siblingCount > 1 &&
                  [ //<div className="previous" title="Previous" key="prev">◀ <span>Previous</span></div>
                  , <div className="siblings" title="List Alternatives" key="list" onClick={e => this.showReplies(node.parent.id)}>≡ <span>See alternatives</span></div>
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
