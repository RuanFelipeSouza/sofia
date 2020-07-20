import React from 'react';
import ReactQuill from 'react-quill';
/* 
 * Simple editor component that takes placeholder text as a prop 
 */
class Editor extends React.Component {
    constructor (props) {
        super(props)
        this.state = { value: props.value, setValue: props.setValue }
        this.handleChange = this.handleChange.bind(this)
    }
    
    handleChange (html) {
        this.state.setValue(html);
    }
    
    render () {
        return (
            <div>
                <ReactQuill 
                    theme='snow'
                    onChange={this.handleChange}
                    defaultValue={this.state.value}
                    modules={Editor.modules}
                    formats={Editor.formats}
                    bounds={'.app'}
                    placeholder={this.props.placeholder}
                />
            </div>
       )
    }
  }
  
  /* 
   * Quill modules to attach to editor
   * See https://quilljs.com/docs/modules/ for complete options
   */
Editor.modules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        ['link', 'image', 'video'],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
}
  /* 
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]

export default Editor;