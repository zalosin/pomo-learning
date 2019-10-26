import React, { Component } from 'react';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  class ToastDemo extends Component {
    notify = () => toast.info("Learning time has passed. Time for a break!");


    render(){
      return (
        <div>
          <button onClick={this.notify}>Notify !</button>
          <ToastContainer 
            position="top-center"
            autoClose={6000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnVisibilityChange={false}
            draggable={false}
            pauseOnHover={false}
            />
        </div>
      );
    }
  }

  export default ToastDemo;