import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Container from '@material-ui/core/Container';

import PrivateRoute from './PrivateRoute';

import LoginPage from './Auth/LoginPage';
import CoursesPage from './Courses/CoursesPage';
import ProfilePage from './Profile/ProfilePage';
import ReadingTime from './ReadingTime/ReadingTime';
import ToastDemo from './Toast/Toast';

import './App.scss';

function App() {
  const homeRoute = localStorage.getItem('userInfo') ? CoursesPage : LoginPage;
  return (
    <Router>
      <Container component="main" maxWidth="lg">
        <Route exact path="/" component={homeRoute} />
        <Route path="/login" component={LoginPage} />
        <PrivateRoute path="/profile" component={ProfilePage} />
        <Route path="/stats" component={ReadingTime} />
        <Route path="/toastTest" component={ToastDemo} />
      </Container>
    </Router>
  );
}

export default App;
