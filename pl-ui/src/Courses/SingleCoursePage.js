import React, {Component} from 'react';
import EditableCourseChunk from "./EditableCourseChunk";
import Api from '../Api';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import {convertToRaw} from "draft-js";

class SingleCoursePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: {title:'', chunks: []}
        }
    }

    componentDidMount() {
        const {match:{params: {code}}, history} = this.props;
        Api.get(`courses/${code}`).then(resp=>{
            if(!resp) {
                history.push('/courses');
            } else {
                this.setState({course: resp})
            }
        })
    }

    setChunk = (i, chunk)=>{
        const {course} = this.state;
        const {chunks} = course;
        chunks[i] = chunk;
        this.setState({
            course: {...course, chunks}
        })
    };

    addChunk = ()=>{
        const {course} = this.state;
        course.chunks.push('');
        this.setState({course});
    };

    putChanges = ()=>{
        const {match:{params: {code}}} = this.props;
        const {course} = this.state;
        Api.put(`courses/${code}`, {
            ...course,
            chunks: course.chunks.map(chunk=>convertToRaw(chunk))
        });
    };

    render() {
        const {course} = this.state;
        return (
            <div>
                <Typography variant="h4">
                    {course.title}
                </Typography>
                {course.chunks.map((chunk, key)=> {
                    console.log(chunk);
                    return <EditableCourseChunk setChunk={this.setChunk} index={key} key={key}/>
                }
                )}
                <Button
                    variant="contained"
                    onClick={this.addChunk}
                    style={{marginTop:"20px"}}
                >
                    <AddIcon />
                </Button>
                {!!course.chunks.length && (
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
