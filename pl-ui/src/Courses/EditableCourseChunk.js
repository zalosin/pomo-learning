import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {stateToHTML} from "draft-js-export-html";
import {convertFromRaw} from "draft-js";
import MUIRichTextEditor from "../RTETestPage";

class EditableCourseChunk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: props.editorState || null
        }
    }
    render() {
        return (
            <MUIRichTextEditor
                label="Hello welcome to course editor"
                onSave={data=>{
                    console.log(stateToHTML(convertFromRaw(JSON.parse(data))))
                }}
            />
        );
    }
}

EditableCourseChunk.propTypes = {};

export default EditableCourseChunk;
