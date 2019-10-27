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
            contentState: props.chunk ? props.chunk : emptyEditorState.getCurrentContent(),
            stats: {}
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

    estimateTime = (editorState) => {
        const {} = this.props;
        const htmlCourse = stateToHTML(editorState.getCurrentContent());
        this.setState({
            stats: readingTime(htmlCourse, {wordsPerMinute: 75})
        });
    };

    renderEditorDataHTML = () => {
        const {contentState} = this.state;
        const {index, setEditMode, isStudent} = this.props;
        return (
            <div style={{position: 'relative', border: "1px solid #ccc", width:"800px", padding: "20px 10px", borderRadius:"6px"}}>
                <div dangerouslySetInnerHTML={{__html: stateToHTML(contentState)}} />
                {!isStudent && (
                    <IconButton
                        size="small"
                        onClick={()=>setEditMode(index, true)}
                        style={{position: 'absolute', right: 0, top: 0}}
                    >
                        <EditIcon />
                    </IconButton>
                )}
                <div>
                    {}
                </div>
            </div>
        )
    };

    render() {
        const {contentState, defaultDataLoaded, stats} = this.state;
        const {editMode} = this.props;
        const rawDraftContentState = JSON.stringify(convertToRaw(contentState));
        const {minutes} = stats;
        const controls = ["title", "bold", "italic", "underline", "strikethrough", "highlight", "undo", "redo", "link", "media", "numberList", "bulletList", "quote", "code", "clear"];

        if (minutes <= 2) {
            controls.push("save");
        }
        return (
            <div>
                {editMode ? (
                    <div>
                        <MUIRichTextEditor
                            label="Start typing..."
                            value={(!defaultDataLoaded) ? rawDraftContentState : undefined}
                            controls={controls}
                            onChange={this.estimateTime}
                            onSave={data=>{
                                const jsonData = JSON.parse(data);
                                if(jsonData.blocks.length === 1 && jsonData.blocks[0].text==='') {
                                    this.onSave(false)
                                } else {
                                    this.onSave(convertFromRaw(jsonData));
                                }
                            }}
                        />
                        {!!stats.text && (
                            <div style={{
                                color: minutes <= 2 ? "green" : "red"
                            }}>
                                {stats.text}
                                {minutes > 2 && (
                                    <p>
                                        This chunk is too big! Move some of the info into a new chunk.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ) : this.renderEditorDataHTML()}
            </div>
        );
    }
}

export default EditableCourseChunk;
