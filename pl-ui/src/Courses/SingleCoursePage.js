import React, {Component} from 'react';
import EditableCourseChunk from "./EditableCourseChunk";
import Api from '../Api';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import {convertFromRaw, convertToRaw} from "draft-js";
import {withAuthentication} from "../AuthContext";
import Modal from '@material-ui/core/Modal';
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import {animated, useSpring} from "react-spring";


const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter();
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited();
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {children}
        </animated.div>
    );
});

class SingleCoursePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: {title:'', chunks: []},
            editModeArray: [],
            chunkIndex: 0,
            chunksToShow: 2,
            open: false
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

    setModalOpen = (open)=>{
        this.setState({
            open
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
        const {course, editModeArray, open} = this.state;
        const {authentication: {userInfo}} = this.props;

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
                        editMode={userInfo.isStudent ? false : editModeArray[key]}
                        isStudent={userInfo.isStudent}
                        setEditMode={this.setEditMode}
                    />
                }
                )}
                {!userInfo.isStudent && (
                    <Button
                        variant="contained"
                        onClick={this.addChunk}
                        style={{marginTop:"20px"}}
                    >
                        <AddIcon />
                    </Button>
                )}
                {!userInfo.isStudent &&
                    !!course.chunks.length &&
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
                {userInfo.isStudent && (
                    <Modal
                        aria-labelledby="spring-modal-title"
                        aria-describedby="spring-modal-description"
                        open={open}
                        onClose={()=>this.setModalOpen(false)}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={open}>

                        </Fade>
                    </Modal>
                )}
            </div>
        );
    }
}

export default withAuthentication(SingleCoursePage);
