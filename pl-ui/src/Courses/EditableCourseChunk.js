import React, {Component} from 'react';
import {stateToHTML} from "draft-js-export-html";
import {EditorState, convertFromRaw, convertToRaw, ContentState} from "draft-js";
import MUIRichTextEditor from "mui-rte";
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Api from '../Api';
import readingTime from 'reading-time';

class EditableCourseChunk extends Component {
    constructor(props) {
        super(props);
        const emptyEditorState = EditorState.createEmpty();
        this.state = {
            contentState: props.chunk ? convertFromRaw(props.chunk) : emptyEditorState.getCurrentContent()
        }
    }

    onSave = (contentState) => {
        const {setChunk, index, setEditMode} = this.props;
        setEditMode(index, false);
        if(contentState === false) {
            setChunk(index, contentState);
            return;
        }
        this.setState({
            contentState,
            defaultDataLoaded: false
        });
        setChunk(index, contentState);
    };

    renderEditorDataHTML = () => {
        const {contentState} = this.state;
        const {index, setEditMode} = this.props;
        return (
            <div style={{position: 'relative', border: "1px solid #ccc", width:"800px", padding: "20px 10px", borderRadius:"6px"}}>
                <div dangerouslySetInnerHTML={{__html: stateToHTML(contentState)}} />
                <IconButton
                    size="small"
                    onClick={()=>setEditMode(index, true)}
                    style={{position: 'absolute', right: 0, top: 0}}
                >
                    <EditIcon />
                </IconButton>
                <div>
                    {}
                </div>
            </div>
        )
    };

    render() {
        const {contentState, defaultDataLoaded} = this.state;
        const {editMode} = this.props;
        const rawDraftContentState = JSON.stringify(convertToRaw(contentState));

        return (
            <div>
                {editMode ? (
                    <MUIRichTextEditor
                        label="Start typing..."
                        value={(!defaultDataLoaded) ? rawDraftContentState : undefined}
                        onSave={data=>{
                            const jsonData = JSON.parse(data);
                            if(jsonData.blocks.length === 1 && jsonData.blocks[0].text==='') {
                                this.onSave(false)
                            } else {
                                this.onSave(convertFromRaw(jsonData));
                            }
                        }}
                    />
                ) : this.renderEditorDataHTML()}
            </div>
        );
    }
}

export default EditableCourseChunk;
