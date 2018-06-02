import { createElement, Component } from 'react'
import { DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import { DATA_URL, TEXT } from './constants'

const spec = {
  drop(props, monitor, component) {
    const { files } = monitor.getItem()
    const reader = new FileReader()
    Promise.all(
      files
        .filter(props.filter || (i => i))
        .map(file => new Promise((resolve, reject) => {
          reader.onload = event => {
            file.content = event.target.result
            resolve(file)
          }

          const readAs = typeof props.readAs === 'function'
            ? props.readAs(file)
            : props.readAs

          if (readAs === DATA_URL) {
            reader.readAsDataURL(file)
          } else {
            reader.readAsText(file, 'UTF-8')
          }
        }))
    ).then(files => {
      component.setState(state => ({
        lastContent: files,
        history: [files, ...state.history]
      }))
      props.onDrop(files)
    })
  }
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  monitor,
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
})

class Dropperx extends Component {
  constructor(props) {
    super(props)

    this.state = {
      lastContent: null,
      history: []
    }
  }
  render() {
    return this.props.connectDropTarget(
      createElement(
        'div',
        {},
        this.props.children({
          __monitor__: this.props.monitor,
          isOver: this.props.isOver,
          canDrop: this.props.canDrop,
          files: this.state.lastContent,
          history: this.state.history
        })
      )
    )
  }
}

Dropperx.defaultProps = {
  filter: i => i,
  onDrop: () => {},
  readAs: 'TEXT'
}

export default DropTarget(NativeTypes.FILE, spec, collect)(Dropperx)
