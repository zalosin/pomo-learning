import React, {Component} from 'react';
import EditableCourseChunk from "./EditableCourseChunk";
import Api from '../Api';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import {convertFromRaw, convertToRaw} from "draft-js";

class SingleCoursePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: {title:'', chunks: []},
            editModeArray: []
        }
    }

    componentDidMount() {
        const {match:{params: {code}}, history} = this.props;
        Api.get(`courses/${code}`).then(resp=>{
            if(!resp) {
                history.push('/courses');
            } else {
                const {chunks} = resp;
                resp.chunks = chunks.map(chunk => convertFromRaw(chunk));
                this.setState({course: resp, editModeArray: resp.chunks.map(()=>false) })
            }
        })
    }

    setChunk = (i, chunk)=>{
        const {course, editModeArray} = this.state;
        const {chunks} = course;
        if(chunk === false) {
            chunks.splice(i, 1);
            editModeArray.splice(i, 1);
        } else {
            chunks[i] = chunk;
        }
        this.setState({
            course: {...course, chunks},
            editModeArray
        })
    };

    setEditMode = (i, mode)=>{
        const {editModeArray} = this.state;
        editModeArray[i] = mode;
        this.setState({
            editModeArray
        })
    };

    addChunk = ()=>{
        const {course, editModeArray} = this.state;
        course.chunks.push('');
        editModeArray.push(true);
        this.setState({course, editModeArray});
    };

    putChanges = ()=>{
        const {match:{params: {code}}} = this.props;
        const {course} = this.state;
        Api.put(`courses/${code}`, {
            ...course,
            chunks: course.chunks
                .map(chunk => convertToRaw(chunk))
        });
    };

    render() {
        const {course, editModeArray} = this.state;
        return (
            <div>
                <Typography variant="h4" style={{marginTop: "20px"}}>
                    {course.title}
                </Typography>
                {course.description && (
                    <Typography variant="h5" style={{marginTop: "10px", marginBottom: "10px"}}>
                        {course.description}
                    </Typography>
                )}
                {course.chunks.map((chunk, key)=> {
                    return <EditableCourseChunk
                        chunk={chunk}
                        setChunk={this.setChunk}
                        index={key}
                        key={key}
                        editMode={editModeArray[key]}
                        setEditMode={this.setEditMode}
                    />
                }
                )}
                <Button
                    variant="contained"
                    onClick={this.addChunk}
                    style={{marginTop:"20px"}}
                >
                    <AddIcon />
                </Button>
                {!!course.chunks.length &&
                    !(course.chunks.length===1 && course.chunks[0] === '') &&
                    editModeArray.every(editMode=>!editMode) &&
                (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.putChanges}
                        style={{marginTop:"20px", marginLeft: "20px"}}
                    >
                        SAVE
                    </Button>
                )}
            </div>
        );
    }
}

export default SingleCoursePage;
