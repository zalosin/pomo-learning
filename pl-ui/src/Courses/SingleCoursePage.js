import React, {Component} from 'react';
import Api from '../Api';
import EditableCourseChunk from "./EditableCourseChunk";

class SingleCoursePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: null
        }
    }

    render() {
        return (
            <EditableCourseChunk/>
        );
    }
}

export default SingleCoursePage;
