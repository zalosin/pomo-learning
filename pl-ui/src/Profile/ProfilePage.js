import React, { Component } from 'react';
import { Container } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import './ProfilePage.scss'

const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    dense: {
      marginTop: theme.spacing(2),
    },
    menu: {
      width: 200,
    },
  }));

function ProfilePage() {

    const classes = useStyles();

    const [values, setValues] = React.useState({
        name: 'Ching Chong',
        college: 'Scoala Vietii',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        
        
      });

      const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
      };   

        return(
            <form className='container' noValidate autoComplete="off">
                <img src={'avatar.png'} height={250} alt={"avatar"}/> 
                <div className='description'>
                    <TextField
                    id="outlined-name"
                    label="Name"
                    className={classes.textField}
                    value={values.name}
                    onChange={handleChange('name')}
                    margin="normal"
                    variant="outlined"
                    />
                    
                    <TextField
                    id="outlined-name"
                    label="College"
                    className={classes.textField}
                    value={values.college}
                    onChange={handleChange('college')}
                    margin="normal"
                    variant="outlined"
                     />

                    <TextField
                    id="outlined-multiline-flexible"
                    label="Description"
                    multiline
                    rowsMax="6"
                    value={values.description}
                    onChange={handleChange('description')}
                    className={classes.textField}
                    margin="normal"
                    
                    variant="outlined"
                    />
                </div>
            </form>
        )
}

export default ProfilePage;