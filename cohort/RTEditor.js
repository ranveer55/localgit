import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
class RTEditor extends Component {
    render() {
        return (
           <CKEditor
            
                    editor={ ClassicEditor }
                    data={this.props.data}
                    config={ {
                        toolbar: [ 'heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote' ],
                        heading: {
                            options: [
                                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
                            ]
                        }
                    } }
                   
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        if(this.props.onChange){
                            this.props.onChange(data)
                        }
                    } }
                    
                />
        );
    }
}

export default RTEditor;
