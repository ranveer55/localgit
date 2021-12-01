import React from 'react';
import FroalaEditor from 'react-froala-wysiwyg';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
// import 'font-awesome/css/font-awesome.css';
const RTEditor =({data,onChange}) =><FroalaEditor
model={data}
onModelChange={onChange}
/>
export default RTEditor;