import React, { Component, Fragment } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';

import Api from '../Api';

export default class CoursesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            courses: [],
        };
    }

    componentDidMount = () => {
        Api.get('courses')
            .then(json => {
                this.setState({ courses: json });
            });
    }

    render() {
        const { courses } = this.state;
        const fabStyle= { position: 'fixed', bottom: '50px', right: '50px' };

        return (
            <Fragment>
                <List>
                    {courses.map(course => (
                        <RouterLink to={`/courses/${course.id}`}>
                            <ListItem divider>
                                <ListItemText
                                    primary={course.title}
                                    secondary={course.description}
                                />
                            </ListItem>
                        </RouterLink>
                    ))}
                    
                    <RouterLink to="/createCourse">
                        <Fab color="primary" style={fabStyle} >
                            <AddIcon />
                        </Fab>
                    </RouterLink>
                </List>
            </Fragment>
        );
    }
}