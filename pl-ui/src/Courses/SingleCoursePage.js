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
import Timer from "react-compound-timer"

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
            open: false,
            working: false,
            startedWorking: false,
            modalText: 'Start the course',
            modalAction: this.startWorking,
            modalButtonText: "BEGIN",
        }
    }

    componentDidMount() {
        const {match:{params: {code}}, history} = this.props;
        const {authentication: {userInfo}} = this.props;
        Api.get(`courses/${code}`).then(resp=>{
            if(!resp) {
                history.push('/courses');
            } else {
                const {chunks} = resp;
                resp.chunks = chunks.map(chunk => convertFromRaw(chunk));
                this.setState({course: resp, editModeArray: resp.chunks.map(()=>false) })
            }
        }).then(()=>{
            if(userInfo.isStudent) {
                this.setModalOpen(true);
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

    startWorking = () => {
        const {startedWorking} = this.state;
        const newState = {
            open: false,
            working: true
        };
        if(!startedWorking) {
            newState.startedWorking = true
        }
        this.setState(newState);
    };

    stopWorking = () => {
        const {chunkIndex, chunksToShow, course: {chunks}} = this.state;
        if(chunkIndex + chunksToShow >= chunks.length) {
            this.setState({
                open: false,
                startedWorking: false,
                working: false,
                chunkIndex: chunks.length
            })
        } else {
            this.setState({
                open: true,
                working: false,
                chunkIndex: chunksToShow + chunkIndex,
            });
        }
    };

    render() {
        const {course, editModeArray, open, working, startedWorking, modalText, modalAction, modalButtonText, chunksToShow, chunkIndex} = this.state;
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
                        greyedOut={userInfo.isStudent && (key < chunkIndex || key >= chunkIndex+chunksToShow)}
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
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Fade in={open}>
                            <div style={{
                                border: "2px solid #000",
                                padding: "16px 32px 24px",
                                boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
                                backgroundColor: "#fff",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                <h3>{modalText}</h3>
                                {modalButtonText && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={modalAction}
                                    >
                                        {modalButtonText}
                                    </Button>
                                )}
                            </div>
                        </Fade>
                    </Modal>
                )}
                {userInfo.isStudent && working && (
                    <Timer
                        initialTime={15000}
                        direction="backward"
                        checkpoints={[
                            {
                                time: 0,
                                callback: () => {
                                    this.stopWorking();
                                    this.setState({
                                        modalButtonText: '',
                                        modalText: 'Enjoy your break!'
                                    })
                                },
                            }
                        ]}
                    >
                        {() => (
                            <div
                                style={{
                                    position: "fixed",
                                    top: "120px",
                                    right: "20px",
                                    borderRadius: "5px",
                                    border: "2px solid #000",
                                    padding: "10px",
                                    fontSize: "30px",
                                    boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
                                    backgroundColor:"#fff"
                                }}
                            >
                                <Timer.Minutes />:<Timer.Seconds />
                            </div>
                        )}
                    </Timer>
                )}
                {userInfo.isStudent && startedWorking && !working && (
                    <Timer
                        initialTime={5000}
                        direction="backward"
                        checkpoints={[
                            {
                                time: 0,
                                callback: () => this.startWorking(),
                            }
                        ]}
                    >
                        {() => (
                            <div
                                style={{
                                    position: "fixed",
                                    top: "120px",
                                    right: "20px",
                                    borderRadius: "5px",
                                    border: "2px solid #000",
                                    padding: "10px",
                                    fontSize: "30px",
                                    boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
                                    backgroundColor:"#fff"
                                }}
                            >
                                <Timer.Minutes />:<Timer.Seconds />
                            </div>
                        )}
                    </Timer>
                )}
            </div>
        );
    }
}

export default withAuthentication(SingleCoursePage);
