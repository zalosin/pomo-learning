import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Container from '@material-ui/core/Container';

import PrivateRoute from './PrivateRoute';

import LoginPage from './Auth/LoginPage';
import LogoutPage from './Auth/LogoutPage';
import CoursesPage from './Courses/CoursesPage';
import ProfilePage from './Profile/ProfilePage';
import ReadingTime from './ReadingTime/ReadingTime';
import ToastDemo from './Toast/Toast';

import { withAuthentication } from './AuthContext';

import AppHeader from './AppHeader';
import './App.scss';


function App({ authentication }) {
  const { userInfo } = authentication;
  const homeRoute = userInfo ? CoursesPage : LoginPage;

  return (
    <Router>
      <AppHeader userInfo={userInfo} />
      <Container component="main" maxWidth="lg">
        <Route exact path="/" component={homeRoute} />
        <Route path="/login" component={LoginPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/stats" component={ReadingTime} />
        <Route path="/toastTest" component={ToastDemo} />
      </Container>
    </Router>
  );
}

export default withAuthentication(App);
