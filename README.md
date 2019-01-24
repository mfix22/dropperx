# `<Dropperx/>` 📁✊

Wrap any function-as-child component to turn it into a Drop zone that reads the contents of files. A _prescribed_ method for reading files in the browser.

#### Usage:

```javascript
import Dropperx from 'dropperx'

// inside component tree
<Dropperx 
  onDrop={files => this.setState({ files })} 
  accept="image/png" 
  maxSize={10000}
>
  {({ canDrop, files, history }) => (
    <Overlay title={`Drop your files here to import ${canDrop ? '✋' : '✊'}`}>
      <Upload filesContents={files.map(file => file.content)} />
      {history.map(bundle => (
        <li>bundle</li>
      ))}
    </Overlay>
  )}
</Dropperx>
```

## Props

- `onDrop(files)`: Callback called with an array of files dropped. Get the contents of the file from `files[0].content`
- `filter`: Function passed to `files.filter(filter)`. Lets you control which files are read.
- `accept`: List of comma separated MIME types
- `minSize`: Minimum file size
- `maxSize`: Maximum file size

## Child Callback Function

The function you pass into `Dropperx` is called with a single object containing these keys:

- `isOver`: Boolean that says whether cursor is over the target
- `canDrop`: Boolean that states if able to drop on the window. This is true if the cursor is holding files
- `files`: Array of files that were last dropped. `null` if nothing has been dropped.
- `history`: Array of past dropped contents. `history[0]` contains the array of files last dropped.

## License

MIT
