import React, {Component} from 'react';

import Api from "../Api";
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button";

class CreateCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: ''
        }
    }
    createNewCourse = ()=>{
        const {history} = this.props;
        const {title} = this.state;
        Api.post('courses', {
            title,
            chunks: []
        }).then(({courseId})=>{
            history.push(`/course/${courseId}`);
            // console.log(resp.courseId)
        })
    };

    changeTitle = (e) => {
        this.setState({ title: e.target.value });
    };
    render() {
        const {title} = this.state;
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
