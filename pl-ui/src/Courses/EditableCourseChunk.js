import React, {Component} from 'react';
import {stateToHTML} from "draft-js-export-html";
import {EditorState, convertFromRaw, convertToRaw, ContentState} from "draft-js";
import MUIRichTextEditor from "mui-rte";
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Api from '../Api';

class EditableCourseChunk extends Component {
    constructor(props) {
        super(props);
        const emptyEditorState = EditorState.createEmpty();
        this.state = {
            editMode: false,
            contentState: props.chunk ? convertFromRaw(props.chunk) : emptyEditorState.getCurrentContent()
        }
    }

    onSave = (contentState) => {
        const {setChunk, index} = this.props;
        this.setState({
            editMode: false,
            contentState,
            defaultDataLoaded: false
        });
        setChunk(index, contentState);
    };

    renderEditorDataHTML = () => {
        const {contentState} = this.state;
        return (
            <div style={{position: 'relative', border: "1px solid #ccc", width:"800px", padding: "20px 10px", borderRadius:"6px"}}>
                <div dangerouslySetInnerHTML={{__html: stateToHTML(contentState)}} />
                <IconButton
                    size="small"
                    onClick={()=>this.setState({editMode: true})}
                    style={{position: 'absolute', right: 0, top: 0}}
                >
                    <EditIcon />
                </IconButton>
            </div>
        )
    };

    render() {
        const {editMode, contentState, defaultDataLoaded} = this.state;
        const rawDraftContentState = JSON.stringify(convertToRaw(contentState));

        return (
            <div>
                {editMode ? (
                    <MUIRichTextEditor
                        label="Start typing..."
                        value={(!defaultDataLoaded) ? rawDraftContentState : undefined}
                        onSave={data=>this.onSave(convertFromRaw(JSON.parse(data)))}
                    />
                ) : this.renderEditorDataHTML()}
            </div>
        );
    }
}

export default EditableCourseChunk;
