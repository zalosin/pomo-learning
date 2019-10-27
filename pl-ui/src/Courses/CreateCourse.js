import React, {Component} from 'react';

import Api from "../Api";
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button";

class CreateCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
        }
    }
    createNewCourse = ()=>{
        const {history} = this.props;
        const {title, description} = this.state;
        Api.post('courses', {
            title,
            description,
            chunks: []
        }).then(({courseId})=>{
            history.push(`/course/${courseId}`);
            // console.log(resp.courseId)
        })
    };

    changeTitle = (e) => {
        this.setState({ title: e.target.value });
    };
    changeDescription = (e) => {
        this.setState({ description: e.target.value });
    };
    render() {
        const {title, description} = this.state;
        return (
            <div>
                <form noValidate>
                    <TextField
                        value={title}
                        onChange={this.changeTitle}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="courseTitle"
                        label="Course Title"
                        name="courseTitle"
                        autoFocus
                    />
                    <TextField
                        value={description}
                        onChange={this.changeDescription}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="courseDescription"
                        label="Course Description"
                        name="courseDescription"
                    />
                    {title && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.createNewCourse}
                        >
                            CREATE
                        </Button>
                    )}
                </form>
            </div>
        );
    }
}

export default CreateCourse;
