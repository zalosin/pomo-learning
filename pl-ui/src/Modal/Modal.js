import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring';
import './Modal.scss';
import IconButton from '@material-ui/core/IconButton';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Api from '../Api';
import { Button, Input } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

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

export default function SpringModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  
  let studyTime = 0;
  let breakTime = 0;

  function changeLearn(e){
    studyTime = e.target.value;
    console.log(studyTime)
  }

  function changeRest(e){
    breakTime = e.target.value;
    console.log(breakTime)
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  function sendValues(){
    const userInfo = JSON.parse(localStorage.getItem('userInfo')).id;
    console.log(userInfo);
    const body = {
      timeSettings : {
        learnTime : studyTime,
        breakTime : breakTime
      }
    }
    console.log(`Sending -> ${JSON.stringify(body)}`);
    Api.put(`profile/${userInfo}`,body).then(json => {
      setOpen(false);

    });
  }

  return (
    <div>
      <IconButton
          edge="end"
          onClick={handleOpen}
          style={{ color: 'white' }}
      >
          <HourglassEmptyIcon />
      </IconButton>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="spring-modal-title">Build your tempo</h2><hr/>
            <p id="spring-modal-description">Allocate your time to learn, but also to rest:</p>
            <form>
              <label>Time of learning</label>
              <br/>
              <Input type='number' name='learn' onChange={changeLearn} placeholder='> 20' min="20"></Input>
              <br/>
              <br/>
              <label>Resting time</label>
              <br/>
              <Input type='number' name='rest' onChange={changeRest} placeholder='> 0' min='0' max="20"></Input>
              <br/>
              <Button onClick={sendValues} variant="contained" color="primary" style={{ display: 'flex', marginLeft: 'auto' }}>Submit</Button>
              <br/>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}