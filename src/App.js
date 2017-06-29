import React, { Component } from 'react'
import cn from 'classnames'
import './App.css'
import Tree from './Tree.js'

window.Tree = Tree
var a = new Tree('Hello world')
a.addNext('Okay world, I love you')
a.addParallel('No no no, I hate you')
a.addNext('But why?')
a.addNext('Oh, Shut up')
a.addNext('I love you too', 2)
a.addNext('The world loves me')
a.addParallel('No wait, it doesnt')
a.addNext('Im so happy', 7)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="app">
        <div className="chat-container">
        {
          ((head, arr) => {
            const createClosure = id => e => this.setState({ opened: id })
            do {
              const siblingCount = head.parent && head.parent.children.length;
              arr.push(
                <div
                  className={cn('chat', { opened: this.state.opened === head.id })}
                  key={head.id}
                  onClick={createClosure(head.id)}
                >
                  <div className="text">{head.value}</div>
                  <div className="id">{head.id}</div>
                  { siblingCount > 1 && <div className="children-count">{siblingCount}</div> }
                  <div className="controls">
                    <div className="reply" title="Reply">➥ <span>Reply</span></div>
                    <div className="star" title="Star">⭐ <span>Star</span></div>
                    <div className="comment" title="Comment">💬 <span>Comment</span></div>
                    { siblingCount > 1 &&
                      [ <div className="previous" title="Previous" key="prev">◀ <span>Previous</span></div>
                      , <div className="list" title="List" key="list">≡ <span>List alternatives</span></div>
                      , <div className="next" title="Next" key="next"><span>Next</span> ▶</div>
                      ]
                    }
                  </div>
                </div>
              )
            } while(head.children.length && (head = head.children[0]))
            return arr
          })(a.root, [])
        }
        </div>
        <div className="input-container">
          <textarea placeholder="Type here..."></textarea>
          <div className="send">Send</div>
        </div>
      </div>
    )
  }
}

export default App
