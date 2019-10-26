import React, {Component} from 'react';
import {stateToHTML} from "draft-js-export-html";
import {EditorState, convertFromRaw, convertToRaw, ContentState} from "draft-js";
import MUIRichTextEditor from "mui-rte";
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';

class EditableCourseChunk extends Component {
    constructor(props) {
        super(props);
        const emptyEditorState = EditorState.createEmpty();
        this.state = {
            editMode: false,
            contentState: props.contentState || emptyEditorState.getCurrentContent()
        }
    }

    onSave = (contentState) => {
        this.setState({
            editMode: false,
            contentState,
            defaultDataLoaded: false
        })
    };

    renderEditorDataHTML = () => {
        const {contentState} = this.state;
        return (
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={()=>this.setState({editMode: true})}
                >
                    <EditIcon />
                </Button>
                <div dangerouslySetInnerHTML={{__html: stateToHTML(contentState)}} />
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
