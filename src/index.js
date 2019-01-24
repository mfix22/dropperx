import React from 'react'
import Dropzone from 'react-dropzone'

import { DATA_URL, TEXT } from './constants'

function readAs(file) {
  if (file.type === '') return DATA_URL

  const mimeStart = file.type.split('/')[0]

  switch (mimeStart) {
    case 'application':
    case 'text':
      return TEXT
    case 'image':
    case 'video':
      return DATA_URL
    default:
      return TEXT
  }
}

class Dropperx extends React.Component {
  state = {
    lastContent: null,
    history: []
  }

  handleDrop = files => {
    const reader = new FileReader()
    Promise.all(
      files.filter(this.props.filter).map(
        file =>
          new Promise(resolve => {
            reader.onload = event => {
              file.content = event.target.result
              resolve(file)
            }

            const type = readAs(file)

            if (type === DATA_URL) {
              reader.readAsDataURL(file)
            } else {
              reader.readAsText(file, 'UTF-8')
            }
          })
      )
    ).then(files => {
      this.setState(state => ({
        lastContent: files,
        history: [files, ...state.history]
      }))
      this.props.onDrop(files)
    })
  }

  render() {
    return (
      <Dropzone
        onDrop={this.handleDrop}
        accept={this.props.accept}
        minSize={this.props.minSize}
        maxSize={this.props.maxSize}
      >
        {({ getRootProps, isDragActive, isDragAccept }) => {
          const rootProps = getRootProps()
          return (
            <div {...rootProps}>
              {this.props.children({
                isOver: isDragActive,
                canDrop: isDragAccept,
                files: this.state.lastContent,
                history: this.state.history
              })}
            </div>
          )
        }}
      </Dropzone>
    )
  }
}

Dropperx.defaultProps = {
  filter: i => i,
  onDrop: () => {}
}

export default Dropperx
